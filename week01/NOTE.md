# 每周总结可以写在这里
## [添加entity的前端知识结构](https://swimmerrcd.github.io/前端技术_SwimmerRcd.xmind)

## Types
- ECMAScript Language Types
  
        Undefined, Null, Boolean, String, Symbol, Number,
        and Object.
- ECMAScript Specification Types
  
         Reference, List, Completion,
         Property Descriptor, Lexical Environment, 
         Environment Record, and Data Block
## URI解析
```
var parseURI=function(uri){
    let regURI = /^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/
    if(regURI.test(uri)){
        let URIelements = regURI.exec(uri)
        return {
            'Reference':uri,
            'scheme':URIelements[2],
            'authority':URIelements[4],
            'path':URIelements[5],
            'query':URIelements[7],
            'fragment':URIelements[9]
        }
    }else{
        return ''
    }
}
```
- [RFC2396 --> RFC3986的改变说明](https://svn.apache.org/repos/asf/labs/webarch/trunk/uri/rev-2002/issues.html)
- [RFC3986: URI最新标准](https://tools.ietf.org/html/rfc3986)
- [RFC2396: URI过时标准](https://tools.ietf.org/html/rfc2396)
- [URI中文说明](https://blog.csdn.net/harvic880925/article/details/44679239)

## 总结
- 知识应该是线索（用于解决问题），而不是零散的枝叶，建立知识的体系
- 使用时，顺着线索进行追根溯源，让其自然地开枝散叶。并且一插到底，找到祖宗，确保知识的正确性