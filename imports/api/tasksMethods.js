import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { TasksCollection, VisitorsCollection, VisitsCollection } from '/imports/db/TasksCollection';
import {WebApp} from 'meteor/webapp';

WebApp.connectHandlers.use('/hello', async (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  // res.setHeader("Access-Control-Allow-Headers", "Authorization,Content-Type");

  res.writeHead(200);

  qq = req.query;
  console.log(qq["kind"]);

  if (qq["kind"] == "barcodeDataUpdate") {
    // console.log(qq.fieldName);
    // console.log(JSON.stringify(qq));
    console.log(Meteor.call("visitors.barcodeDataUpdate", qq.barcodeId, qq.fieldName, qq.fieldVal));
    res.end(JSON.stringify(`Hello world from: ${Meteor.release}`));
  }
  else if (qq["kind"] == "barcodeSearch") {
    // console.log("search attempt");
    barcodeRes = await(Meteor.call("visitors.findByBarcode", qq.barcodeId))
    // console.log(barcodeRes);
    if (barcodeRes)
      res.end(JSON.stringify(barcodeRes));
    else {
      res.end(JSON.stringify("not found"));
    }
  }
})


const randomString = function () {
  ss = String(new Date().getTime()) + String(Math.trunc(Math.random()*1000));
  return ss.slice(ss.length-8, ss.length+1);
}

Meteor.methods({
  'visitors.findByName'(name) {
    console.log(VisitorsCollection.findOne({"name": name}));
    return VisitorsCollection.findOne({"name": name});

  },

  'barcode.makeNew' () {
    barcodeId = String(new Date().getTime()) + String(Math.trunc(Math.random()*100));
    barcodeId = barcodeId.slice(8, 15)
    while (VisitorsCollection.find({barcodeId: barcodeId}).count() > 0) {
        barcodeId = String(new Date().getTime()) + String(Math.trunc(Math.random()*100));
        barcodeId = barcodeId.slice(8, 15)
    }
    return barcodeId;
  },

  'visitors.findByBarcode'(barcodeId) {
    console.log(barcodeId);
    return VisitorsCollection.findOne({"barcodeId": barcodeId});
  },

  'visitors.findByBarcode'(code) {
    // console.log(code);
    // console.log(VisitorsCollection.findOne({"barcodeId": code}));
    return VisitorsCollection.findOne({"barcodeId": code});
  },

  'visitors.insert'(name, notes) {
    // check(text, String);

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    visCount = 0;
    //TODO: create new random number for barcode creation
    // [random 3 digit string] +  [5 digit index] + [random 4 digit string];
    // visCount = VisitorsCollection.find().count();

    // barcodeId = String(Math.trunc(Math.random()*1000)) + String(visCount).padStart(5,'0') + String(Math.trunc(Math.random()*1000));

    barcodeId = Meteor.call("barcode.makeNew");

    VisitorsCollection.insert({
      name: name,
      // gender: gender,
      // age: age,
      // dob: dob, 
      notes: notes,
      currentRoom: "brand new",
      index: visCount,
      barcodeId: barcodeId,
      createdAt: new Date(),
      insertedBy: this.userId,
    });
  },

  'visitors.barUpdate' (id) {
    // console.log(id);
    
// <<<<<<< Updated upstream
//     barcodeId = randomString();
    
//     // confirm that no one else has this barcodeId
//     while (VisitorsCollection.find({barcodeId: barcodeId}).count() > 0) {
//         barcodeId = randomString();
//     }
// =======
    barcodeId = Meteor.call("barcode.makeNew");
    
    // confirm that no one else has this barcodeId
    
// >>>>>>> Stashed changes
    
    VisitorsCollection.update({_id: id}, {$set: {barcodeId: barcodeId}});
    return barcodeId;
  },

  'visitors.barcodeDataUpdate' (barcodeId, field, value) {
    console.log(field, value);
    newData = {};
    newData[field] = value;
    // console.log("bcd up")
    return VisitorsCollection.update (
    {
      barcodeId: barcodeId
    }, {
      $set: newData
    },
    {upsert: true})
  },

  'visitors.qrNameUpdate' (qrcode, newname) {
    // newData = {};
    // newData[field] = value;
    // setQuery = {$set: newData}
    // console.log("bcd up")
    VisitorsCollection.update (
    { barcodeId: qrcode }, 
    { $set: { "name": newname } },
    // { upsert: true }
    );
    // console.log(newvid);
    // newvBar = Meteor.call('visitors.barUpdate', newvid)
    // console.log(newvBar);
    // return newvBar;
  },

  'visitors.qrFeatureUpdate' (qrcode, feature, value) {
    let newData = {};
    newData[feature] = value;
    setQuery = {$set: newData}
    // console.log("bcd up")
    VisitorsCollection.update (
    { barcodeId: qrcode }, 
    { $set: newData},
    // { upsert: true }
    );
    // console.log(newvid);
    // newvBar = Meteor.call('visitors.barUpdate', newvid)
    // console.log(newvBar);
    // return newvBar;
  },

  'visitors.nameUpdate' (name, field, value) {
    let newData = {};
    newData[field] = value;
    setQuery = {$set: newData}
    // console.log("bcd up")
    newvid = VisitorsCollection.update (
    { name: name }, 
    { $set: newData },
    { upsert: true });
    // console.log(newvid);
    // newvBar = Meteor.call('visitors.barUpdate', newvid)
    // console.log(newvBar);
    // return newvBar;
  },

  // 'visitors.update'( id, room ) {
  //   VisitorsCollection.update({_id: id}, {$set: {currentRoom: room, lastUpdated: new Date()}});

  // },

  'visits.insert' (id, room) {
    //check that id exists    
    console.log(room);
    const visitor = VisitorsCollection.findOne({ _id: id});
    if (!visitor) {
      throw new Meteor.Error('Access denied.');
      return("visitor not found for visitor");
    }
    else {
      VisitsCollection.insert({
        visitor: id,
        time: new Date(),
        room: room,
        
      });

      VisitorsCollection.update({_id: id}, {
        $set: {
          currentRoom: room,
          lastUpdated: new Date()
        }
      });
      return("room update successful!");
    }   
  },

  'tasks.insert'(text) {
    check(text, String);

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    TasksCollection.insert({
      text,
      createdAt: new Date(),
      userId: this.userId,
    });
  },

  'tasks.remove'(taskId) {
    check(taskId, String);

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    const task = TasksCollection.findOne({ _id: taskId, userId: this.userId });

    if (!task) {
      throw new Meteor.Error('Access denied.');
    }

    TasksCollection.remove(taskId);
  },

  'tasks.setIsChecked'(taskId, isChecked) {
    check(taskId, String);
    check(isChecked, Boolean);

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    const task = TasksCollection.findOne({ _id: taskId, userId: this.userId });

    if (!task) {
      throw new Meteor.Error('Access denied.');
    }

    TasksCollection.update(taskId, {
      $set: {
        isChecked,
      },
    });
  },
});
