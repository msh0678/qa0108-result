// qa0108-result: 결과 화면
window.ETHOS_STEP={v:1,app:"qa0108-result",shell:"https://ethos.ai.kr https://www.ethos.ai.kr",parent:""};
function ethosTask(){ return new Promise(function(res){ var S=ETHOS_STEP.shell.split(" "); if(window.parent===window||S[0].indexOf("__")===0){res({ok:false,offline:true});return;} var done=false; function on(e){ if(e.source!==window.parent||S.indexOf(e.origin)<0||!e.data||e.data.type!=="ethos.task.context") return; done=true; ETHOS_STEP.parent=e.origin; window.removeEventListener("message",on); res({ok:true,kind:e.data.kind,task:e.data.task||null,input:(e.data.input&&e.data.input.text)||"",run:e.data.run||{},outputs:e.data.outputs||[]}); } window.addEventListener("message",on); S.forEach(function(o){ try{window.parent.postMessage({type:"ethos.task.ready",v:1,app:ETHOS_STEP.app},o);}catch(x){} }); setTimeout(function(){ if(!done){window.removeEventListener("message",on); res({ok:false,offline:true});} },4000); }); }
function ethosTaskSubmit(data){ if(window.parent===window||!ETHOS_STEP.parent) return {ok:false,offline:true}; window.parent.postMessage({type:"ethos.task.submit",v:1,data:data||{}},ETHOS_STEP.parent); return {ok:true,pending:true}; }
// ---- 아래는 화면 동작 (스니펫 이후 추가 코드) ----
(function(){
  // 검수용 예시 결과
  var SAMPLE_OUTPUTS = [
    {name:"확정 금액", text:"1,250,000원"},
    {name:"승인 의견", text:"확인했습니다. 정산 진행해 주세요."},
    {name:"처리 일시", text:"2026-10-07"}
  ];
  function $(id){ return document.getElementById(id); }

  // 전달받은 결과(outputs)를 카드로 표시 (입력칸 없음)
  function renderCards(outputs, offline){
    var box = $("cards"); box.textContent = "";
    var list = (outputs && outputs.length) ? outputs : (offline ? SAMPLE_OUTPUTS : []);
    if(!list.length){
      $("empty").textContent = "표시할 결과가 아직 없습니다.";
      return;
    }
    $("empty").textContent = "";
    list.forEach(function(o){
      var d = document.createElement("div"); d.className = "out-card";
      var h = document.createElement("h3"); h.textContent = o.name || "결과";
      var p = document.createElement("p"); p.textContent = o.text || "-";
      d.appendChild(h); d.appendChild(p); box.appendChild(d);
    });
    if(offline) $("offlineNote").hidden = false;
  }

  document.addEventListener("DOMContentLoaded", function(){
    $("topBtn").addEventListener("click", function(){
      window.scrollTo({top:0, behavior:"smooth"});
    });
    ethosTask().then(function(ctx){
      if(ctx.offline){ renderCards([], true); return; }
      renderCards(ctx.outputs, false);
    });
  });
})();
