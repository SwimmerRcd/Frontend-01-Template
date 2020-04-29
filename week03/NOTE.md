# 每周总结可以写在这里
# JavaScript | 表达式，类型准换
根据这节课上讲师已写好的部分，补充写完函数 convertStringToNumber以及函数 convertNumberToString
- convertStringToNumber
  
        function convertStringToNumber(string, radix = 10) {
            if (radix > 10) {
                return;
            }
            let flag = /e|E/.test(string);
            if (!flag) {
                let chars = string.split('');
                let number = 0;
                let i = 0;
                while (i < chars.length && chars[i] != '.') {
                    number = number * radix;
                    number += chars[i].codePointAt(0) - '0'.codePointAt(0);
                    i++;
                }
                if (chars[i] === '.') {
                    i++;
                }
                let fraction = 1;
                while (i < chars.length) {
                    fraction /= radix;
                    number += (chars[i].codePointAt(0) - '0'.codePointAt(0)) * fraction;
                    i++;
                }
                return number;
            } else {
                let logNumber = Number(string.match(/\d+$/)[0]);
                let number = string.match(/^[\d\.]+/)[0].replace(/\./, '');
                if (/e-|E-/.test(string)) {
                    return Number(number.padEnd(logNumber + 1, 0));
                } else {
                    return Number(number.padStart(logNumber + number.length, 0).replace(/^0/, '0.'));
                }
            }
        }

- convertNumberToString
  
        function convertNumberToString(number, x = 10) {
            var integer = Math.floor(number);
            var fraction = null;
            if (x === 10) fraction = ('' + number).match(/\.\d*/)[0];
            var string = '';
            while(integer > 0) {
                string = integer % x + string;
                integer = Math.floor(integer / x);
            }
            return fraction ? string + fraction : string;
        }

# JavaScript | 语句，对象
根据课上老师的示范，找出 JavaScript 标准里所有的对象，分析有哪些对象是我们无法实现出来的，这些对象都有哪些特性？写一篇文章，放在学习总结里。

- Ordinary Object：普通Object, key-value组成的一个指针

        - [[GetPrototypeOf]] ( )
        - OrdinaryGetPrototypeOf ( O )
        - [[SetPrototypeOf]] ( V )
          - OrdinarySetPrototypeOf ( O, V )
        - [[IsExtensible]] ( )
        - OrdinaryIsExtensible ( O )
        - [[PreventExtensions]] ( )
          - OrdinaryPreventExtensions ( O )
        - [[GetOwnProperty]] ( P )
          - OrdinaryGetOwnProperty ( O, P )
        - [[DefineOwnProperty]] ( P, Desc )
          - OrdinaryDefineOwnProperty ( O, P, Desc )
          - IsCompatiblePropertyDescriptor ( Extensible, Desc, Current )
          - ValidateAndApplyPropertyDescriptor ( O, P, extensible, Desc, current )
        - [[HasProperty]] ( P )
          - OrdinaryHasProperty ( O, P )
        - [[Get]] ( P, Receiver )
          - OrdinaryGet ( O, P, Receiver )
        - [[Set]] ( P, V, Receiver )
          - OrdinarySet ( O, P, V, Receiver )
          - OrdinarySetWithOwnDescriptor ( O, P, V, Receiver, ownDesc )
        - [[Delete]] ( P )
          - OrdinaryDelete ( O, P )
        - [[OwnPropertyKeys]] ( )
          - OrdinaryOwnPropertyKeys ( O )
        - ObjectCreate ( proto [ , internalSlotsList ] )
        - OrdinaryCreateFromConstructor ( constructor, intrinsicDefaultProto [ ,internalSlotsList ] )
        - GetPrototypeFromConstructor ( constructor, intrinsicDefaultProto )
- ECMAScript Function Objects：相较于普通Object，有一个[[Call]]的属性
        具体参看ECMA-262: 章节9.2
- Built-in Function Objects：相较于普通Function Object，[[Construct]]默认不能调用

        具体参看ECMA-262: 章节9.3
- Built-in Exotic Object：javascript自带的对象
  
        具体参看ECMA-262: 章节9.4
  
  1. Bound Function Exotic Objects：用Function new出来的对象
  2. Array Exotic Objects：带array index（+0~2^32-2）的对象
  3. String Exotic Objects：对象的value有数字下标属性，还有一个随value值变化的length属性
  4. Arguments Exotic Objects：参数对象
  5. Integer-Indexed Exotic Objects：带Integer-Index(+0~2^53-1)的对象
  6. Module Namespace Exotic Objects：有一堆binding name的string-keyed对象
  7. Immutable Prototype Exotic Objects：属性初始化后不可变的对象
- Proxy Object：用handler指向implemention的对象，本身没有implemention

        具体参看ECMA-262: 章节9.5

**注：以上章节中[[]]括起来的就是无法用javascript实现的特殊属性**