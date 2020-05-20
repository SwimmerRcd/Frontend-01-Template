# 跟上课堂内容，完成 DOM 树构建
```
const css = require('css');

const EOF = Symbol("EOF");
let currentToken = null;
let currentAtrribute = null;
let currentTextNode = null;

let stack = [ {type: "document", children:[] }];

let rules = [];
function addCssRules(text) {
    var ast = css.parse(text);
    // console.log(JSON.stringify(ast, null, " "));
    rules.push(...ast.stylesheet.rules);
}

function match(element, selector) {
    if (!selector || !element.attributes) return false;

    if (selector.charAt(0) == "#") {
        var attr = element.attributes.filter(attr => attr.name === "id")[0];
       if (attr && attr.value === selector.replace("#", ''))
            return true;
    } else if (selector.charAt(0) == ".") {
        var attr = element.attributes.filter(attr => attr.name === "class")[0];
        if (attr && attr.value === selector.replace(".",''))
            return true;
    } else {
        if (element.tagName === selector) {
            return true;
        }
    }
    return false;

}
function specificity(selector) {
    var p = [0,0,0,0];
    var selectorParts = selector.split(" ");
    for (var part of selectorParts) {
        if (part.charAt(0) == "#") {
            p[1] += 1;
        } else if (part.charAt(0) == ".") {
            p[2] += 1;
        } else {
            p[3] += 1;
        }
    }
    return p;
}
function compare(sp1,sp2) {
    if (sp1[0] - sp2[0]) {
        return sp1[0] -sp2[0];
    }
    if (sp1[1] - sp2[1]) {
        return sp1[1] -sp2[1];
    }
    if (sp1[2] - sp2[2]) {
        return sp1[2] -sp2[2];
    }
    return sp1[3] - sp2[3];
    
}
function computeCss(element) {
    var elements = stack.slice().reverse();
    if (!element.computedStyle) 
           element.computedStyle = {};
   
    for (let rule of rules) {
        var selectorParts = rule.selectors[0].split(" ").reverse();

        if(!match(element,selectorParts[0])) continue;

        // let matched = false;

        var j = 1;
        for (var i=0; i < elements.length; i++) {
            if (match(elements[i], selectorParts[j])) {
                j++;
            }
        }
        if (j >= selectorParts.length) 
           matched = true;
        
        if (matched) {
            var sp = specificity(rule.selectors[0]);
            var computedStyle = element.computedStyle;
            for(var declaration of rule.declarations) {
                if (!computedStyle[declaration.property]){
                    computedStyle[declaration.property] = {}
                }
                if (!computedStyle[declaration.property].specificity){
                    computedStyle[declaration.property].value = declaration.value;
                    computedStyle[declaration.property].specificity = sp;
                } else if (compare(computedStyle[declaration.property].specificity, sp) < 0){
                    computedStyle[declaration.property].value = declaration.value;
                    computedStyle[declaration.property].specificity = sp;
                }
                  
            }
        }
    }
}

function emit (token) {
    // if (token.type != "text")
    //      return;

    let top = stack[stack.length - 1];

    if(token.type == "startTag") {
        let element = {
            type: "element",
            children: [],
            attributes: []
        };
        element.tagName = token.tagName;
        for (let p in token) {
            if (p != "type" || p != "tagName"){
              element.attributes.push({
                  name: p,
                  value: token[p]
              });
            }
        }
        computeCss(element);

        top.children.push(element);

        // element.parent = top;

        if (!token.isSelfClosing){
            stack.push(element);
        }

        currentTextNode = null;

    } else if (token.type == "endTag") {
        if (top.tagName != token.tagName) {
            // console.log("Tag start end doesn't match!");
            // throw new Error("Tag start end doesn't match!");
        } else {
            if (top.tagName === "style") {
                addCssRules(top.children[0].content);
            }
            stack.pop();
        }
        currentTextNode = null;
    } else if (token.type == "text") {
        if (currentTextNode == null) {
            currentTextNode = {
                type: "text",
                content: ""
            }
            top.children.push(currentTextNode);
        }
        currentTextNode.content += token.content;
    }
}
function data(c) {
    // console.log(c);
   if (c == "<") {
       return tagOpen;
   } else if ( c == EOF ) {
       emit({
           type: "EOF"
       });
       return ;
   } else {
       emit({
           type:"text",
           content: c
       });
       return data;
   }
}

function tagOpen(c) {
    if (c == "/") {
        return endTagOpen;
    } else if (c.match(/^[a-zA-Z]$/)){
        currentToken = {
            type: "startTag",
            tagName: ""
        }
        return tagName(c);
    } else {
        emit({
            type: "text",
            content: c
        })
        return ;
    }
}

function tagName(c) {
    if (c.match(/^[\t\n\f]$/)) {
        return beforeAttributeName;
    } else if (c == "/") {
        return selfClosingStartTag;
    } else if (c.match(/^[A-Z]$/)){
        currentToken.tagName += c
        return tagName;
    } else if (c == ">" ){
        emit(currentToken);
        return data;
    } else {
        currentToken.tagName += c;
        return tagName;
    }
}

function beforeAttributeName(c) {
    if (c.match(/^[\t\n\f]$/)) {
        return beforeAttributeName;
    } else if (c== "/" || c == ">" || c == EOF) {
        return afterAttributeName(c);
    } else if (c == "=") {
       
    } else {
       currentAtrribute = {
           name: "",
           value: ""
       }
       return attributeName(c);
    }
}

function attributeName(c) {
    if (c.match(/^[\t\n\f]$/) || c == "/" || c == ">" || c == EOF) {
        return afterAttributeName(c);
    } else if (c == "=") {
        return beforeAttributeValue;
    } else if (c == "\u0000") {

    } else if (c == "\"" || c == "'" || c == "<") {

    } else {
        currentAtrribute.name += c;
        return attributeName;
    }
}
function beforeAttributeValue(c) {
    if (c.match(/^[\t\n\f]$/) || c == "/" || c== ">" || c == EOF) {
        return beforeAttributeValue;
    } else if (c == "\"") {
        return doubleQuotedAttributeValue;
    } else if (c == "\'") {
        return singleQuotedAttributeValue;
    } else if (c == ">") {
        return data;
    } else {
        return UnquotedAttributeValue(c);
    }

}
function doubleQuotedAttributeValue(c) {
    if (c == "\"") {
        currentToken[currentAtrribute.name] = currentAtrribute.value;
        return afterQuotedAttributeValue;
    } else if (c == "\u0000") {

    } else if (c == EOF) {

    } else {
        currentAtrribute.value += c;
        return doubleQuotedAttributeValue;
    }
}
function singleQuotedAttributeValue(c) {
    if (c == "\'") {
        currentToken[currentAtrribute.name] = currentAtrribute.value;
        return afterQuotedAttributeValue;
    } else if (c == "\u0000") {

    } else if (c == EOF) {

    } else {
        currentAtrribute.value += c;
    }
    return doubleQuotedAttributeValue;
}
function afterQuotedAttributeValue(c) {
    if(c.match(/^[\t\n\f]$/)) {
        return beforeAttributeName;
    } else if (c == "/") {
        return selfClosingStartTag;
    } else if (c == ">") {
        currentToken[currentAtrribute.name] = currentAtrribute.value;
        emit(currentToken);
        return data;
    } else if (c == EOF) {

    } else {
        currentAtrribute.value += c;
        return doubleQuotedAttributeValue;
    }
}

function UnquotedAttributeValue(c) {
    if (c.match(/^[\t\n\f]$/)) {
        currentToken[currentAtrribute.name] = currentAtrribute.value;
        return beforeAttributeName;
    } else if (c == "/") {
        currentToken[currentAtrribute.name] = currentAtrribute.value;
        return selfClosingStartTag;
    } else if (c == ">") {
        currentToken[currentAtrribute.name] = currentAtrribute.value;
        emit(currentToken);
        return data;
    } else if (c == "\u0000") {

    } else if (c == "\"" || c == "'" || c == "<" || c == "=" || c == "`") {

    } else if (c == EOF) {

    } else {
        currentAtrribute.value += c;
        return UnquotedAttributeValue;
    }
}
function selfClosingStartTag(c) {
    if (c == ">") {
        currentToken.isSelfClosing = true;
        emit(currentToken);
        return data;
    } else if (c == "EOF") {

    } else {

    }
}


function endTagOpen(c) {
    if (c.match(/^[a-zA-Z]$/)) {
        currentToken = {
            type: "endTag",
            tagName: ""
        }
        return tagName(c);
    } else if (c == ">") {

    } else if (c == EOF) {

    } else {

    }
}
function afterAttributeName(c) {
    if (c.match(/^[\t\n\f]$/)) {
        return afterAttributeName;
    } else if (c == "/") {
        return selfClosingStartTag;
    } else if (c == "=") {
        return beforeAttributeValue;
    } else if (c == ">") {
        currentToken[currentAtrribute.name] = currentAtrribute.value;
        emit(currentToken);
        return data;
    } else if (c == EOF) {

    } else {
        currentToken[currentAtrribute.name] = currentAtrribute.value;
        currentAtrribute = {
            name : "",
            value: ""
        };
        return attributeName(c);
    }
}
module.exports.parseHTML = function parseHTML(html) {
    // console.log(html);
    let state = data;
    for(let c of html) {
        state = state(c);
    }
    state = state(EOF);
    return stack[0];
}
```
# 每周总结可以写在这里
## 浏览器对CSS处理的整个过程
1. 获取所有CSS规则（读遍整个HTML文件，包括引用文件）
2. 将CSS规则应用到HTML的element上
3. 当多个CSS规则匹配到同一个element上时，会比对优先级，优先级高的会覆盖优先级低的，优先级相同时，物理位置靠后的规则覆盖物理位置靠前的规则
4. CSS规则优先级分6级
    | 级别 | 元素                       | 权重值 |
    | :--- | :------------------------- | :----: |
    | 5    | !important                 | 10000  |
    | 4    | inline style               |  1000  |
    | 3    | id选择器                   |  100   |
    | 2    | 类/伪类/属性选择器         |   10   |
    | 1    | 元素/伪元素选择器          |   1    |
    | 0    | 通配符选择器或者一些连接符 |   0    |

    
        计算的时候，会把每条规则按各个级别拆开汇总，各个级别的个数再乘以各级别的权重值，然后总权重值大的获胜
5. 子孙选择器，是父元素下的所有同名元素都有效，包括儿子，孙子...
6. 父子选择器，是父元素下只对儿子元素有效