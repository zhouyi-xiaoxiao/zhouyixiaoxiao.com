const u="\\u2E80-\\u9FFF\\u3000-\\u303F\\uFF00-\\uFFEF",F=new RegExp(`([${u}])[ \\u00A0]+(?=[${u}])`,"g");function e(u){return u.replace(F,"$1")}export{e as z};
