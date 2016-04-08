//UTILITIES!

// 1. ifStyle(styles)
export function ifStyle() {
  var res = {};
  for (var i = 0; i < arguments.length; ++i) {
    if (arguments[i]) {
      Object.assign(res, arguments[i]);
    }
  }
  return res;
}

/* Use this function for if/else style classes. The style objects will combine if conditions are met. Use this instead of having multiple .classes

Example:
const styles = {
  baseStyle: {
    backgroundColor: red
  }
  ifSelected: {
    border: '1px solid blue'
  }
}

<div className="component" style={ifStyle(
  styles.baseStyle,
  this.state.isSelected && styles.ifSelected
)}

IF this.state.isSelected === true, DOM shows:
component {
  background-color: red;
  border: 1px solid blue;
}
ELSE
component {
  background-color: red;
}

*/

// 2. flattenObject(object)
export const flattenObject = (ob) => {
  var toReturn = {};

  for (var i in ob) {
    if (!ob.hasOwnProperty(i)) continue;

    if ((typeof ob[i]) == 'object') {
      var flatObject = flattenObject(ob[i]);
      for (var x in flatObject) {
        if (!flatObject.hasOwnProperty(x)) continue;

        toReturn[x] = flatObject[x];
      }
    } else {
      toReturn[i] = ob[i];
    }
  }
  return toReturn;
};

/* Use this function to flatten an object into a flat 1lvl hierarchy.

Example:
var one = {
  0: {
    id: 1,
    color: red
  }
}

const flatOne = flattenObject(one);

console.log(flatOne);

Object {
  id: 1,
  color: red
}

*/
