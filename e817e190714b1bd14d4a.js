var addSorting=function(){"use strict";var e,t={index:0,desc:!1};function r(){return document.querySelector(".coverage-summary table")}function n(){return r().querySelector("thead tr")}function o(e){return n().querySelectorAll("th")[e]}function a(t){var r,n,o,a,u=t.querySelectorAll("td"),c={};for(o=0;o<u.length;o+=1)r=u[o],n=e[o],a=r.getAttribute("data-value"),"number"===n.type&&(a=Number(a)),c[n.key]=a;return c}function u(){o(t.index).className+=t.desc?" sorted-desc":" sorted"}return function(){r()&&(e=function(){var e,t,r,o=n().querySelectorAll("th"),a=[];for(r=0;r<o.length;r+=1)t={key:(e=o[r]).getAttribute("data-col"),sortable:!e.getAttribute("data-nosort"),type:e.getAttribute("data-type")||"string"},a.push(t),t.sortable&&(t.defaultDescSort="number"===t.type,e.innerHTML=e.innerHTML+'<span class="sorter"></span>');return a}(),function(){var e,t=r().querySelector("tbody").querySelectorAll("tr");for(e=0;e<t.length;e+=1)t[e].data=a(t[e])}(),u(),function(){var r,n,a=function(r){var n=e[r];return function(){var a=n.defaultDescSort;t.index===r&&(a=!t.desc),function(t,r){var n,o=e[t].key,a=function(e,t){return(e=e.data[o])<(t=t.data[o])?-1:e>t?1:0},u=a,c=document.querySelector(".coverage-summary tbody"),d=c.querySelectorAll("tr"),l=[];for(r&&(u=function(e,t){return-1*a(e,t)}),n=0;n<d.length;n+=1)l.push(d[n]),c.removeChild(d[n]);for(l.sort(u),n=0;n<l.length;n+=1)c.appendChild(l[n])}(r,a),function(){var e=o(t.index),r=e.className;r=r.replace(/ sorted$/,"").replace(/ sorted-desc$/,""),e.className=r}(),t.index=r,t.desc=a,u()}};for(r=0;r<e.length;r+=1)e[r].sortable&&((n=o(r).querySelector(".sorter")).addEventListener?n.addEventListener("click",a(r)):n.attachEvent("onclick",a(r)))}())}}();window.addEventListener("load",addSorting);