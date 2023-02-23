const { format } = require('date-fns');
var express = require('express');
var router = express.Router();
var Events = require('../model/Event');
var Remarks = require('../model/Remark');


// feching event
router.get('/:id',(req,res,next)=>{
    var id=req.params.id
   Events.findById(id).populate('remarks').exec((err,eventDetail)=>{
    if(err)return next(err)
    console.log(eventDetail)
    res.render('eventDetail',{ eventDetail })
   })
})

// add remark
router.post('/:id/addremark',(req,res,next)=>{
    var id=req.params.id
    req.body.eventId=id
    Remarks.create(req.body,(err,remark)=>{
        console.log(remark)
        Events.findByIdAndUpdate(id,{$push:{remarks:remark}},(err,event)=>{
            if(err)return next(err)
            res.redirect('/remarks/' + id)
        })
    })
})

// remark like
router.get('/:id/likes', (req, res, next) => {
    var id = req.params.id
    Remarks.findByIdAndUpdate(id, { $inc: { likes: 1 } }, { new: true }, (err, remark) => {
      if (err) return next(err)
      res.redirect('/remarks/' + remark.eventId)
    })
  })

// remark dislike
router.get('/:id/dislikes', (req, res, next) => {
    var id = req.params.id
    Remarks.findByIdAndUpdate(id, { $inc: { dislikes: 1 } }, { new: true }, (err, remark) => {
      if (err) return next(err)
      res.redirect('/remarks/' + remark.eventId)
    })
  })

//   edit remark
router.get('/:id/edit', (req, res, next) => {
    var id = req.params.id
    Remarks.findById(id, (err, remark) => {
      if (err) return next(err)
      res.render('updateRemark',{ remark })
    })
  })

//   update remark
router.post('/:id/', (req, res, next) => {
    var id = req.params.id
    Remarks.findByIdAndUpdate(id,req.body, (err, remark) => {
      if (err) return next(err)
      res.redirect('/remarks/' + remark.eventId)
    })
  })
  
  //   delete remark
  router.get('/:id/delete', (req, res, next) => {
      var id = req.params.id
      Remarks.findByIdAndDelete(id, (err, deleteRemark) => {
        console.log(deleteRemark,deleteRemark.eventId)
        Events.findByIdAndUpdate(deleteRemark.eventId,{$pull :{remarks:deleteRemark._id}},(err,event)=>{
             if (err) return next(err)
             console.log(event)
            res.redirect('/remarks/' + event._id)
        })
      })
    })


module.exports = router;