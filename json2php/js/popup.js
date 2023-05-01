const outputTextarea = document.getElementById("output");

function isIndexedArray(arr) {
  return Array.isArray(arr) && arr.every((val, index) => index in arr);
}

function jsToPhpArray(obj, depth) {
  let depthStr = '    '.repeat(depth)
  let depthStrV2 = '    '.repeat(depth - 1)
  let result = "array( \n";
  let isFactArray = isIndexedArray(obj);
  console.log(obj, isFactArray)
  let keys = Object.keys(obj);
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i];
    let value = obj[key];
    if (typeof value === "string") {
      if (isFactArray) {
          result += depthStr + `'${value}'`;
      } else {
          result += depthStr + `'${key}' => '${value}'`;
      }
    } else if (typeof value === "number" || typeof value === "boolean") {
      if (isFactArray) {
          result += depthStr + `${value}`;
      } else {
          result += depthStr + `'${key}' => ${value}`;
      }
    } else if (Array.isArray(value)) {
      result += depthStr + `'${key}' => `;
      result += jsToPhpArray(value, depth+1);
    } else {
       if (isFactArray) {
          result += depthStr + ``;
          result += jsToPhpArray(value, depth+1);
       } else {
          result += depthStr + `'${key}' => `;
          result += jsToPhpArray(value, depth+1);
       }
    }
    if (i < keys.length - 1) {
      result += ", \n";
    }
  }
  result += "\n" + depthStrV2 + ")";
  return result;
}

function doConversion()
{
  // 获取输入内容并格式化
  const input = $('#input').val().trim();
  console.log(input)
  if(input == '') {
    return 
  }

  // 将 JSON 字符串转换为 JavaScript 对象
  let jsonObj = {}
  try {
      jsonObj = JSON.parse(input);
  } catch(error) {
     console.log(error)
     $('#output').html('invalid JSON string')
     return
  }

  // 将 JavaScript 对象转换为 PHP 数组格式的字符串
  const phpArrayString = '$array = ' + jsToPhpArray(jsonObj, 1) + ';';
  console.log(phpArrayString)
  // const output = JSON.stringify(JSON.parse(input), null, 2);

  // 显示格式化后的内容
  $('#output').html(phpArrayString)
  Prism.highlightElement(outputTextarea, true)
  $('pre').addClass("line-numbers language-json").css("white-space", "pre-wrap");
}

$('#input').change(function(){
    doConversion();
});

$('#input').keyup(function()
{
    doConversion();
});






