const examModel = require('../../DB/Models/examModel')
const examResultModel = require('../../DB/Models/examResultModel')
const submissionModel = require('../../DB/Models/SubmissionModel')
const questionModel = require('../../DB/Models/questionModel')
const mongoose = require('mongoose')
const asyncHandler = require('express-async-handler')


const startAttemptExam = asyncHandler (async (req, res) => {
    const {examId} = req.params
    const exam = await examModel.findById(examId).select('-createdBy -updatedAt -__v').populate({path:'academicYear',select:'name'}).populate({path:'classLevel',select:'name',populate:{path:'program',select:'name'}}).populate({path:'subject',select:'name'}).lean()
    if(!exam || !exam.isPublished || exam.examDate > Date.now()){
        return res.status(404).json({status:"fail",msg:`exam not available for attempt`})
    }

    // check student attempts count
    const attemptsCount = await submissionModel.countDocuments({
    examAttempt: exam._id,
    student: req.user._id
    });
    if(attemptsCount >= exam.maxAttempts){
        return res.status(400).json({ status: "fail", msg: "You have reached the maximum number of attempts for this exam." });
    }

    // check if user start exam but close it wihout submission
    const existingActiveAttempt = await submissionModel.findOne({
    examAttempt: exam._id,
    student: req.user._id,
    submittedAt: null
    });
    if (existingActiveAttempt) {
        return res.status(200).json({
            status: "success",
            msg: "Continuing your active attempt",
            submissionId: existingActiveAttempt._id,
            examId: exam._id,
            exam,
            questions: await questionModel.find({ exam: exam._id }).select('-correctAnswer -exam -__v -createdBy -updatedAt')
        });
    }

    // fisrt attempt case
    const questions = await questionModel.find({exam:exam._id}).select('-exam -correctAnswer -createdBy -updatedAt -__v')
    if(questions.length === 0){
        return res.status(404).json({status:"fail",msg:`No questions found for this exam`})
    }

    // const date = new Date()
    // const startTime = date.toTimeString().split(' ')[0]
    const newSubmission = new submissionModel({
        examAttempt: exam._id,
        student: req.user._id,
        startedAt: Date.now(),
        answers: [],
        totalScore: 0,
    });
    await newSubmission.save()
    res.status(200).json({status:"success",msg:"Exam started",submissionId:newSubmission._id,examId:exam._id,exam,questions})
})

const submitAnswer = asyncHandler (async (req, res) => {

    const {answer,submissionId,examId} = req.body
    const {questionId} = req.params
    if(!answer || !submissionId){
        return  res.status(400).json({ status: "fail", msg: "Answer and submissionId are required." })
    }

    // check if submission still active and accept answers
    const exam = await examModel.findById(examId)
    if(!exam) return res.status(404).json({ status: "fail", msg: "Exam not found for this question." })
    
    const questions = await questionModel.find({exam:exam._id})
    if(questions.length === 0) return res.status(404).json({ status: "fail", msg: "No questions found for this exam." })  

    const submission = await submissionModel.findOne({
        _id: submissionId,
        student: req.user._id,
        submittedAt: null,
        examAttempt:exam._id,
    })
    if(!submission) return res.status(400).json({ status: "fail", msg: "Submission not active or invalid." })

    // exam duration not finished yet
    const now = new Date()
    const examEndTime = new Date(submission.startedAt.getTime() + exam.duration * 60 * 1000)

    if (now > examEndTime) {
        const results = calcExamData(questions,submission,exam)
        submission.percentage = results.percentage
        submission.grade = results.grade
        submission.questionsCount = results.questionsCount
        submission.totalScore = results.totalScore
        submission.correctAnswers = results.correctAnswers
        submission.wrongAnswers = results.wrongAnswers
        submission.submittedAt = now
        await submission.save()
        return res.status(403).json({ status: "fail", msg: "Exam time is over" })
    } 

    // Get the question and check if it belong to same submission exam
    const question = await questionModel.findById(questionId)
    if (!question) {
        return res.status(404).json({ status: "fail", msg: "Question not found." });
    }

    if(question.exam.toString() !== submission.examAttempt.toString()){
        return res.status(400).json({ status: "fail", msg: "Question does not belong to the exam of this submission." });
    }

    // Prevent answering a question twice
    const alreadyAnswered = submission.answers.some(a => a.question.toString() === questionId)
    if (alreadyAnswered) {
        return res.status(400).json({ status: "fail", msg: "You already answered this question." })
    }
    
    // check if question is true or not
    const isCorrect = answer == question.correctAnswer
    submission.answers.push({
        question: questionId,
        selectedOption: answer,
        isCorrect
    })
    await submission.save()
    res.status(200).json({
        status: "success",
        msg: "Answer submitted."
    })
})

const submitExam = asyncHandler (async (req, res) => {
    const {submissionId,examId} = req.body
    if(!submissionId){
        return  res.status(400).json({ status: "fail", msg: "submissionId is required." })
    }
    // get exam and related questions
    const exam = await examModel.findOne({_id:examId, isPublished:true, examDate:{$lte:Date.now()}})
    if(!exam) return res.status(404).json({ status: "fail", msg: "Exam not found or not acceptable for submission." })  
    const questions = await questionModel.find({exam:exam._id})
    if(questions.length === 0) return res.status(404).json({ status: "fail", msg: "No questions found for this exam." })  

    // check if submission still active and accept answers
    const submission = await submissionModel.findOne({
        _id: submissionId,
        student: req.user._id,
        examAttempt:examId,
        submittedAt: null
    })
    if(!submission) return res.status(400).json({ status: "fail", msg: "Submission not active or invalid." })

    // check if all questions answered
    if(submission.answers.length < questions.length){
        return res.status(400).json({ status: "fail", msg: "You must answer all questions before submitting the exam." })
    }
    // calculate exam results
    const {percentage,grade,questionsCount,totalScore,correctAnswers,wrongAnswers} = calcExamData(questions,submission,exam)

    // finalize submission and create exam result

    const session = await mongoose.startSession()
    try {
        session.startTransaction()
await submissionModel.findByIdAndUpdate(
        submissionId,
        {
            totalScore,
            correctAnswers,
            wrongAnswers,
            questionsCount,
            grade,
            percentage,
            submittedAt: Date.now()
        },{ session }
    );

    await examResultModel.create(
        [{
            exam: exam._id,
            student: req.user._id,
            submission: submissionId,
            score: totalScore,
            totalMarks: exam.totalMarks,
            percentage,
            grade,
            isPassed: percentage >= exam.passMark,
            createdBy: req.user._id
        }],
        { session }
    )

    await session.commitTransaction()
    session.endSession()

    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        return res.status(400).json({status:'fail',msg:'error occured while submitting exam',error:error.message})
    }

    res.status(200).json({
        status: "success",
        msg: "Exam submitted"
    })
})

const calcExamData = (questions, submission, exam)=>{
    let totalScore = 0
    let correctAnswers = 0
    let wrongAnswers = 0

    questions.forEach( q =>{
        const answerRecord = submission.answers.find(a => a.question.toString() === q._id.toString())
        if(answerRecord && answerRecord.isCorrect){
            totalScore += q.marks
            correctAnswers += 1
        } else {
            wrongAnswers += 1
        }
    })

    // calculate other metrics
    let questionsCount = questions.length
    let grade = ''
    let percentage = 0
    percentage = (totalScore / exam.totalMarks) * 100
    if (percentage >= 90) {
        grade = 'A'
    } else if (percentage >= 80) {
        grade = 'B'
    } else if (percentage >= 70) {
        grade = 'C'
    } else if (percentage >= 60) {
        grade = 'D'
    } else {
        grade = 'F'
    }
    return {
        percentage,
        grade,
        questionsCount,
        totalScore,
        correctAnswers,
        wrongAnswers
    }
}



module.exports = {
    startAttemptExam,
    submitAnswer,
    submitExam
} 