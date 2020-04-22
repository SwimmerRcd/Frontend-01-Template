# 作业
- 写一个正则表达式 匹配所有 Number 直接量

        var isValidString=function (literal){
            return //.test(literal)
        }
- 写一个 UTF-8 Encoding 的函数

        function UTF8_Encoding(string) {
        var utf8Code = [];
        var byteSize = 0;
        for (var i = 0; i < string.length; i++) {
            var code = string.charCodeAt(i);
            if (0x00 <= code && code <= 0x7f) {
                    byteSize += 1;
                    utf8Code.push(code);
            } else if (0x80 <= code && code <= 0x7ff) {
                    byteSize += 2;
                    utf8Code.push((192 | (31 & (code >> 6))));
                    utf8Code.push((128 | (63 & code)))
            } else if ((0x800 <= code && code <= 0xd7ff) 
                    || (0xe000 <= code && code <= 0xffff)) {
                    byteSize += 3;
                    utf8Code.push((224 | (15 & (code >> 12))));
                    utf8Code.push((128 | (63 & (code >> 6))));
                    utf8Code.push((128 | (63 & code)))
            }
            }
            for (i = 0; i < utf8Code.length; i++) {
                utf8Code[i] &= 0xff;
            }
            return utf8Code
        }
  
- 写一个正则表达式，匹配所有的字符串直接量，单引号和双引号
  
        var isValidString=function (literal){
            return /"(?:[^"\n\\\r\u2028\u2029]|\\(?:['"\\bfnrtv\n\r\u2028\u2029]|\r\n)|\\x[0-9a-fA-F]{2}|\\u[0-9a-fA-F]{4}|\\[^0-9ux'"\\bfnrtv\n\\\r\u2028\u2029])*"/.test(literal)
               || /'(?:[^'\n\\\r\u2028\u2029]|\\(?:['"\\bfnrtv\n\r\u2028\u2029]|\r\n)|\\x[0-9a-fA-F]{2}|\\u[0-9a-fA-F]{4}|\\[^0-9ux'"\\bfnrtv\n\\\r\u2028\u2029])*'/.test(literal)
        }
  
# 每周总结可以写在这里
[前端知识线索树_总结_20200422](https://swimmerrcd.github.io/frontEnd_zj_20200422.xmind)