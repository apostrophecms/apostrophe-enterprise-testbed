exports.command = function waitForElementReady(selector) {  
  return this
    .waitForElementReady(selector)
    .click(selector);
};

// Notes toward a tighter implementation that would be able to
// find elements, wait for them to be visible and click them
// without using two separate find calls. This is feeling less
// important now that we have [data-apos-modal-current]. -Tom

// const util = require('util');
// const events = require('events');
// const _ = require('lodash');
// const async = require('async');

// function ClickWhenReady() {
//   events.EventEmitter.call(this);
// }

// util.inherits(ClickWhenReady, events.EventEmitter);
    
// ClickWhenReady.prototype.command = function(selector, milliseconds, callback) {

//   const self = this;
//   const found = false;
//   const safe = false;
//   const protocol = require('nightwatch/lib/api/protocol.js')(this.client);
//   const locateStrategy = self.client.locateStrategy || 'css selector';
//   let elements = null;
//   let visible = null;

//   return async.series([
//     find,
//     visible,
//     safe,
//     click
//   ], function(err) {
//     if (err) {
//       bad(err);
//     } else {
//       good();
//     }
//   });

//   function find(callback) {
//     let tries = 0;
//     return protocol.elements(locateStrategy, selector, function(result) {
//       elements = _.map(result.value, 'ELEMENT');
//       if (result.status !== 0) {
//         return callback(result.status);
//       }
//       if (elements.length) {
//         return callback(null);
//       } else {
//         tries++;
//         if (tries === 5000) {
//           return callback(new Error('Timeout in clickWhenReady waiting to find elements'));
//         }
//         return setTimeout(function() {
//           return find(callback);
//         }, 10);
//       }
//     });
//   }

//   function visible(callback) {
//     let tries = 0;
//     visible = [];
//     return async.eachSeries(elements, function(element, callback) {
//       return protocol.elementIdDisplayed(element, function(result) {
//         var now = new Date().getTime();
//         if (result.status === 0 && result.value === true) {
//           visible.push(element);
//         }
//         if (result.status === -1) {
//           return callback(result.status);
//         }
//         return callback(null);
//       });
//     }, function(err) {
//       if (err) {
//         return callback(err);
//       }
//       if (!visible.length) {
//         tries++;
//         if (tries === 5000) {
//           return callback(new Error('Timeout in clickWhenReady waiting to see elements'));
//         }
//         return setTimeout(function() {
//           return visible(callback);
//         }, 10);
//       }
//     });
//   }

//   function safe(callback) {
//     let tries = 0;
//     return protocol.elements('css selector', '.apos-busy,.apos-global-busy', function(result) {
//       elements = _.map(result.value, 'ELEMENT');
//       if (result.status !== 0) {
//         return callback(result.status);
//       }
//       if (result.value.length) {
//         tries++;
//         if (tries === 5000) {
//           return callback(new Error('Timeout in clickWhenReady waiting for apos-busy or apos-global-busy to go away'));
//         }
//         return setTimeout(function() {
//           return safe(callback);
//         }, 10);
//       }
//     });
//   }

//   function click(callback) {
//     if (visible.length > 1) {
//       console.warn('WARNING: more than one visible element matching ' + selector + ', only the first will be clicked.');
//     }
//     // Despite the name this method supports selectors beyond id
//     return protocol.elementIdClick(visible[0], callback);
//   }

//   function good() {
//     if (callback) {
//       callback.call(this.client.api);
//     }
//     this.emit('complete');
//   }

//   function bad() {
//     this.emit('error');
//   }

// };

// module.exports = ClickWhenReady;

