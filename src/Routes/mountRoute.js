const userRoutes = require('./userRoute')
const authRoutes = require('./authRoute')
const academicYearRoute = require('./academicYearRoute')
const academicTermRoute = require('./academicTermRoute')
const subjectRoute = require('./subjectRoute')
const classLevelRoute = require('./classLevelRoute')
const programRoute = require('./programRoute')
const examRoute = require('./examRoute')
const questionRoute = require('./questionRoute')
const examAttemptRoute = require('./examAttemptRoute')
const examResultRoute = require('./examResultRoute')


const mountRoute = (app) => {
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/academic-years', academicYearRoute)
app.use('/api/v1/academic-terms', academicTermRoute)
app.use('/api/v1/subjects', subjectRoute)
app.use('/api/v1/class-levels', classLevelRoute)
app.use('/api/v1/programs', programRoute)
app.use('/api/v1/exams', examRoute)
app.use('/api/v1/questions', questionRoute)
app.use('/api/v1/exam-attempts', examAttemptRoute)
app.use('/api/v1/exam-results', examResultRoute)
}

module.exports = mountRoute