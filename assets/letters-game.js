"use strict";
// Each prompt is checked against the actual contextual letter shape.
const questions=[
{q:"اختر شكل حرف الباء في أول الكلمة",options:["بـ","ـبـ","ـب"],answer:0,ex:"بـ مثل: بَاب"},
{q:"اختر شكل حرف التاء في وسط الكلمة",options:["تـ","ـت","ـتـ"],answer:2,ex:"ـتـ مثل: كِتَاب"},
{q:"اختر شكل حرف الثاء في آخر الكلمة",options:["ثـ","ـث","ـثـ"],answer:1,ex:"ـث مثل: لَيْث"},
{q:"اختر شكل حرف الباء في وسط الكلمة",options:["ـبـ","بـ","ـب"],answer:0,ex:"ـبـ مثل: حَبْل"},
{q:"اختر شكل حرف التاء في آخر الكلمة",options:["ـتـ","تـ","ـت"],answer:2,ex:"ـت مثل: بِنْت"}
];
const $=id=>document.getElementById(id);
let index=0,score=0,answered=false;
const storageKey="abhur-letters-session-v1";
function save(){try{sessionStorage.setItem(storageKey,JSON.stringify({index,score,answered}))}catch(e){}}
function restore(){try{const s=JSON.parse(sessionStorage.getItem(storageKey));if(s&&Number.isInteger(s.index)&&s.index>=0&&s.index<=questions.length&&Number.isInteger(s.score)&&s.score>=0&&s.score<=s.index){index=s.index;score=s.score;answered=false}}catch(e){}}
function draw(){if(index>=questions.length){finish();return}answered=false;const item=questions[index];$("play").classList.remove("hidden");$("end").classList.add("hidden");$("counter").textContent="السؤال "+(index+1)+" من "+questions.length+" · الدرجة "+score;$("question").textContent=item.q;$("choices").replaceChildren();$("feedback").textContent="";$("next").disabled=true;$("next").textContent=index===questions.length-1?"عرض النتيجة":"السؤال التالي";item.options.forEach((option,i)=>{const btn=document.createElement("button");btn.type="button";btn.className="choice";btn.textContent=option;btn.setAttribute("aria-label","الخيار "+(i+1)+": "+option);btn.addEventListener("click",()=>choose(i));$("choices").append(btn)});$("fill").style.width=(index/questions.length*100)+"%";$("bar").setAttribute("aria-valuenow",index);save()}
function choose(i){if(answered)return;answered=true;const item=questions[index];const ok=i===item.answer;if(ok)score++;[...$("choices").children].forEach((b,n)=>{b.disabled=true;if(n===item.answer)b.classList.add("correct");else if(n===i)b.classList.add("wrong")});$("feedback").textContent=(ok?"أحسنت! ":"حاول التعلم من الإجابة الصحيحة. ")+item.ex;$("counter").textContent="السؤال "+(index+1)+" من "+questions.length+" · الدرجة "+score;$("next").disabled=false;save()}
function finish(){$("play").classList.add("hidden");$("end").classList.remove("hidden");$("counter").textContent="النتيجة النهائية: "+score+" من "+questions.length;$("fill").style.width="100%";$("bar").setAttribute("aria-valuenow",questions.length);$("result").textContent=score>=4?"أحسنت! حققت معيار النجاح":"محاولة جيدة! يمكنك التدرب مجددًا";$("summary").textContent="أجبت إجابة صحيحة عن "+score+" من أصل "+questions.length+" أسئلة.";save()}
$("next").addEventListener("click",()=>{if(!answered)return;index++;draw()});$("restart").addEventListener("click",()=>{index=0;score=0;answered=false;draw()});restore();draw();