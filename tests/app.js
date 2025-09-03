const connectDatabase = require('../config/database');
const { config } = require('../config/config');
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ limit: '1mb', extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

const admin_routes = require('../routes/adminRoutes')
const page_routes = require('../routes/pageRoutes')
const feedback_routes = require('../routes/feedBackRoutes')
const footer_routes = require('../routes/footerRoutes')
const project_routes = require('../routes/projectRoutes')
const publication_routes = require('../routes/publicationRoutes')
const news_routes = require('../routes/newsRoutes')
const events_routes = require('../routes/eventsRoutes')

app.get('/', (req, res) => {
    res.send('CSTD Website API')
})

app.use('/api/CSTDsite/admin', admin_routes)
app.use('/api/CSTDsite/pages', page_routes)
app.use('/api/CSTDsite/contact', feedback_routes)
app.use('/api/CSTDsite/footer', footer_routes)
app.use('/api/CSTDsite/project', project_routes)
app.use('/api/CSTDsite/pub', publication_routes)
app.use('/api/CSTDsite/news', news_routes)
app.use('/api/CSTDsite/events', events_routes)

module.exports = app;