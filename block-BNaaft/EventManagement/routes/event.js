const { format } = require('date-fns');
var express = require('express');
var router = express.Router();
var Events = require('../model/Event');
var Remarks = require('../model/Remark');


/* GET events listing. */
router.get('/', function (req, res, next) {
  Events.find({}, (err, events) => {
    if (err) return next(err)
    events.start
    res.render('events', { events })
  })
});

// filters
router.post('/filters', (req, res, next) => {
  var { category, location, start_date, end_date } = req.body
  if (category && location && start_date && end_date) {

    if (category == 'All' && location == "All" && start_date && end_date) {
      Events.find({ start_date: { $lte: start_date }, end_date: { $gte: end_date } }, (err, events) => {
        if (err) return next(err)
        res.render('events', { events })
      })
    } else {
      Events.find({ category: category, location: location, start_date: { $lte: start_date }, end_date: { $gte: end_date } }, (err, events) => {
        if (err) return next(err)
        res.render('events', { events })
      })
    }

  } else {

    if (location && category) {
      if (location === 'All' && category === 'All') {

        Events.find({}, (err, events) => {
          if (err) return next(err)
          res.render('events', { events })
        })
      } else {

        if (location === 'All' && category) {
          Events.find({ category: category }, (err, events) => {
            if (err) return next(err)
            res.render('events', { events })
          })
        } else if (category === 'All' && location) {
          Events.find({ location: location }, (err, events) => {
            if (err) return next(err)
            res.render('events', { events })
          })
        } else {
          Events.find({ location: location, category: category }, (err, events) => {
            if (err) return next(err)
            res.render('events', { events })
          })
        }
      }
    }

  }
})

//  create event form
router.get('/new', (req, res, next) => {
  res.render('createEvent')
})

// create event
router.post('/', (req, res, next) => {
  req.body.category = req.body.category.trim().split(' ')
  Events.create(req.body, (err, events) => {
    if (err) return next(err)
    res.redirect('/events')
  })
})

// fecthing single event
router.get('/:id', (req, res, next) => {
  var id = req.params.id
  Events.findById(id).populate('remarks').exec((err, eventDetail) => {
    if (err) return next(err)
    res.render('eventDetail', { eventDetail })
  })
})

// edit event
router.get('/:id/edit', (req, res, next) => {
  var id = req.params.id
  Events.findById(id, (err, event) => {
    if (err) return next(err)
    event.category = event.category.join(' ')
    // console.log(event, format(event.start_date, 'dd-MM-yyyy'))
    res.render('editEvent', { event, format })
  })
})

// update event

router.post('/:id', (req, res, next) => {
  console.log(req.body)
  var id = req.params.id
  req.body.category = req.body.category.trim().split(' ')
  Events.findByIdAndUpdate(id, req.body, { new: true }, (err, updateEvent) => {
    if (err) return next(err)
    res.redirect('/events/' + id)
  })
})

// likes increament in event
router.get('/:id/likes', (req, res, next) => {
  var id = req.params.id
  Events.findByIdAndUpdate(id, { $inc: { likes: 1 } }, { new: true }, (err, event) => {
    if (err) return next(err)
    res.redirect('/events/' + id)
  })
})

router.get('/:id/like', (req, res, next) => {
  var id = req.params.id
  Events.findByIdAndUpdate(id, { $inc: { likes: 1 } }, { new: true }, (err, event) => {
    if (err) return next(err)
    res.redirect('/events/')
  })
})

// dislikes increament in event
router.get('/:id/dislikes', (req, res, next) => {
  var id = req.params.id
  Events.findByIdAndUpdate(id, { $inc: { dislikes: 1 } }, { new: true }, (err, event) => {
    if (err) return next(err)
    res.redirect('/events/' + id)
  })
})

router.get('/:id/dislike', (req, res, next) => {
  var id = req.params.id
  Events.findByIdAndUpdate(id, { $inc: { dislikes: 1 } }, { new: true }, (err, event) => {
    if (err) return next(err)
    res.redirect('/events/')
  })
})

// delete event
router.get('/:id/delete', (req, res, next) => {
  var id = req.params.id
  Events.findByIdAndDelete(id, (err, deleteEvent) => {
    Remarks.deleteMany({ eventId: id }, (err, deleteRemark) => {
      if (err) return next(err)
      res.redirect('/events/')
    })
  })
})


module.exports = router;
