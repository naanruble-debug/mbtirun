import { useState, useEffect, useCallback, useRef } from 'react';

const CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
:root{
  --blue:#3182F6;--blue2:#1B64DA;--blue-bg:#EBF3FF;
  --orange:#FF6B35;--orange-bg:#FFF1EB;
  --green:#00C471;--green-bg:#E8FBF2;
  --red:#F04452;--red-bg:#FFF0F1;
  --purple:#8B5CF6;--purple-bg:#F3EEFF;
  --bg:#F2F4F6;--white:#FFFFFF;
  --t1:#191F28;--t2:#4E5968;--t3:#8B95A1;--t4:#B0B8C1;
  --border:#DDE1E6;
  --r:16px;--r-sm:10px;
  --shadow:0 2px 16px rgba(0,0,0,.08);
  --shadow-sm:0 1px 6px rgba(0,0,0,.06);
}
html,body{height:100%;background:var(--bg);font-family:'Pretendard',system-ui,sans-serif;color:var(--t1);overflow-x:hidden}
.screen{display:none;flex-direction:column;min-height:100dvh;max-width:480px;margin:0 auto}
.screen.on{display:flex}
.splash-icon{width:80px;height:80px;background:var(--blue);border-radius:24px;display:flex;align-items:center;justify-content:center;margin:0 auto 24px;font-size:36px}
.splash-title{font-size:28px;font-weight:700;color:var(--t1);line-height:1.2;margin-bottom:8px;text-align:center}
.splash-title em{color:var(--blue);font-style:normal}
.splash-sub{font-size:15px;color:var(--t2);line-height:1.6;text-align:center}
.splash-chips{display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin:20px 0 28px}
.chip{background:var(--bg);border-radius:999px;padding:6px 14px;font-size:13px;font-weight:500;color:var(--t2)}
.btn-main{width:100%;background:var(--blue);color:#fff;border:none;border-radius:14px;padding:18px;font-size:17px;font-weight:600;cursor:pointer;letter-spacing:-.2px;transition:background .15s;font-family:inherit}
.btn-main:active{background:var(--blue2)}
.splash-note{font-size:12px;color:var(--t4);margin-top:14px;text-align:center}
.quiz-top{background:var(--white);padding:16px 20px 12px;border-bottom:1px solid var(--border);position:sticky;top:0;z-index:10}
.quiz-meta{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}
.quiz-step{font-size:13px;font-weight:600;color:var(--blue)}
.quiz-dim{font-size:13px;color:var(--t3)}
.progress-outer{height:6px;background:var(--bg);border-radius:99px;overflow:hidden}
.progress-inner{height:100%;background:var(--blue);border-radius:99px;transition:width .35s cubic-bezier(.4,0,.2,1)}
.quiz-body{flex:1;padding:24px 20px}
.q-wrap{transition:opacity .18s,transform .18s}
.q-wrap.out{opacity:0;transform:translateX(-16px)}
.q-wrap.in{opacity:0;transform:translateX(16px)}
.q-card{background:var(--white);border-radius:var(--r);padding:24px 20px;margin-bottom:16px;box-shadow:var(--shadow-sm)}
.q-num{font-size:12px;font-weight:600;color:var(--blue);letter-spacing:.5px;margin-bottom:10px}
.q-text{font-size:17px;font-weight:600;color:var(--t1);line-height:1.55}
.opts{display:flex;flex-direction:column;gap:10px}
.opt{background:var(--white);border:2px solid var(--border);border-radius:14px;padding:16px 18px;cursor:pointer;transition:all .15s;text-align:left;display:flex;align-items:flex-start;gap:12px;font-family:inherit;width:100%}
.opt:active{transform:scale(.98)}
.opt.selected{border-color:var(--blue);background:var(--blue-bg)}
.opt.correct{border-color:var(--green);background:var(--green-bg);animation:pop .22s ease}
.opt-badge{min-width:28px;height:28px;border-radius:8px;background:var(--bg);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:var(--t3);flex-shrink:0;transition:all .15s}
.opt.selected .opt-badge,.opt.correct .opt-badge{background:var(--blue);color:#fff}
.opt-text{font-size:14px;color:var(--t2);line-height:1.55;padding-top:3px;font-weight:400}
.opt.selected .opt-text,.opt.correct .opt-text{color:var(--t1);font-weight:500}
@keyframes pop{0%{transform:scale(.97)}60%{transform:scale(1.025)}100%{transform:scale(1)}}
.result-hero{background:linear-gradient(145deg,#1B64DA 0%,#3182F6 60%,#5BA3F5 100%);padding:40px 24px 36px;color:#fff;text-align:center;position:relative;overflow:hidden}
.result-hero::before{content:'';position:absolute;top:-40px;right:-40px;width:160px;height:160px;background:rgba(255,255,255,.07);border-radius:50%}
.result-hero::after{content:'';position:absolute;bottom:-30px;left:-20px;width:120px;height:120px;background:rgba(255,255,255,.05);border-radius:50%}
.result-label{font-size:13px;font-weight:600;letter-spacing:1px;opacity:.75;margin-bottom:12px}
.result-code{font-size:64px;font-weight:700;letter-spacing:4px;line-height:1;margin-bottom:8px}
.result-name{font-size:20px;font-weight:600;margin-bottom:8px;opacity:.95}
.result-tag{font-size:14px;opacity:.75;font-style:italic;line-height:1.5}
.result-dims{display:flex;justify-content:center;gap:6px;margin-top:20px;flex-wrap:wrap}
.dim-pill{background:rgba(255,255,255,.18);border:1px solid rgba(255,255,255,.25);border-radius:999px;padding:5px 14px;font-size:12px;font-weight:600;color:#fff}
.share-section{background:var(--white);padding:20px;border-bottom:1px solid var(--border)}
.share-title{font-size:13px;font-weight:600;color:var(--t2);margin-bottom:12px}
.share-row{display:flex;gap:10px}
.share-btn{flex:1;display:flex;flex-direction:column;align-items:center;gap:6px;background:var(--bg);border:none;border-radius:12px;padding:14px 8px;cursor:pointer;transition:background .15s;font-family:inherit}
.share-btn:active{background:var(--border)}
.share-btn-icon{width:40px;height:40px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:20px}
.share-btn-label{font-size:11px;font-weight:500;color:var(--t2)}
.result-sections{padding:16px 20px 40px;display:flex;flex-direction:column;gap:10px}
.r-sec{background:var(--white);border-radius:var(--r);overflow:hidden;box-shadow:var(--shadow-sm)}
.r-sec-hdr{display:flex;align-items:center;justify-content:space-between;padding:18px 20px;cursor:pointer}
.r-sec-hdr-left{display:flex;align-items:center;gap:10px}
.r-sec-icon{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0}
.r-sec-icon.blue{background:var(--blue-bg)}
.r-sec-icon.orange{background:var(--orange-bg)}
.r-sec-icon.green{background:var(--green-bg)}
.r-sec-icon.purple{background:var(--purple-bg)}
.r-sec-icon.red{background:var(--red-bg)}
.r-sec-title{font-size:15px;font-weight:600;color:var(--t1)}
.r-sec-chevron{font-size:18px;color:var(--t4);transition:transform .2s;flex-shrink:0}
.r-sec.open .r-sec-chevron{transform:rotate(180deg)}
.r-sec-body{display:none;padding:0 20px 20px;border-top:1px solid var(--border)}
.r-sec.open .r-sec-body{display:block}
.r-list{padding-top:12px;display:flex;flex-direction:column;gap:8px}
.r-item{display:block;font-size:14px;color:var(--t2);line-height:1.7;padding-left:16px;position:relative}
.r-item::before{content:'▸';color:var(--blue);position:absolute;left:0;top:0}
.r-item strong{color:var(--t1);font-weight:600}
.info-box{border-radius:12px;padding:14px 16px;margin-top:14px}
.info-box.blue{background:var(--blue-bg);border:1px solid #B8D4FB}
.info-box.orange{background:var(--orange-bg);border:1px solid #FFCBB8}
.info-box.green{background:var(--green-bg);border:1px solid #A3E9C7}
.info-box.red{background:var(--red-bg);border:1px solid #F9BBBF}
.info-box-title{font-size:12px;font-weight:700;margin-bottom:6px}
.info-box-title.blue{color:var(--blue2)}
.info-box-title.orange{color:var(--orange)}
.info-box-title.green{color:#00965C}
.info-box-title.red{color:var(--red)}
.info-box p{font-size:12px;line-height:1.7}
.info-box p.blue{color:#1B64DA}
.info-box p.orange{color:#CC4A18}
.info-box p.green{color:#00824E}
.info-box p.red{color:#C0303C}
.compat-row{display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--border)}
.compat-row:last-child{border-bottom:none}
.compat-code{font-size:18px;font-weight:700;color:var(--t1);min-width:52px}
.compat-why{font-size:12px;color:var(--t2);flex:1;line-height:1.5}
.compat-score{font-size:13px;font-weight:700;padding:4px 10px;border-radius:8px;white-space:nowrap}
.compat-score.high{background:var(--green-bg);color:#00824E}
.compat-score.low{background:var(--red-bg);color:var(--red)}
.pace-badge{display:inline-flex;align-items:center;gap:6px;border-radius:999px;padding:6px 14px;font-size:13px;font-weight:700;margin-bottom:12px}
.pace-badge.neg{background:var(--green-bg);color:#00824E}
.pace-badge.even{background:var(--blue-bg);color:var(--blue2)}
.pace-badge.rpe{background:var(--purple-bg);color:var(--purple)}
.pace-badge.fneg{background:var(--orange-bg);color:var(--orange)}
.retry-btn{margin:0 20px 24px;background:var(--bg);border:2px solid var(--border);border-radius:14px;padding:16px;font-size:15px;font-weight:600;color:var(--t2);cursor:pointer;text-align:center;font-family:inherit;width:calc(100% - 40px)}
.retry-btn:active{background:var(--border)}
.toast{position:fixed;bottom:80px;left:50%;transform:translateX(-50%) translateY(20px);background:var(--t1);color:#fff;padding:10px 20px;border-radius:999px;font-size:14px;font-weight:500;opacity:0;transition:all .3s;pointer-events:none;white-space:nowrap;z-index:9999}
.toast.on{opacity:1;transform:translateX(-50%) translateY(0)}
@keyframes spin{to{transform:rotate(360deg)}}
.sc-spinner{width:48px;height:48px;border:4px solid rgba(255,255,255,.2);border-top-color:#fff;border-radius:50%;animation:spin .8s linear infinite}
.sc-text{color:#fff;font-size:15px;font-weight:600}
`;

// ─── QUESTIONS ───
const Qs = [
  {q:"5km 완주 후 결승선을 통과했다. 당신이 가장 먼저 하는 행동은?",a:"주변 러너들과 하이파이브, 셀카, 기록 공유. 다음 대회 같이 나갈 사람 섭외 중.",b:"물 한 잔 들고 구석으로. 이어폰 꽂고 기록 앱 확인."},
  {q:"완벽한 일요일 장거리 런의 조건은?",a:"러닝 크루와 함께. 달리면서 수다 떨고 카페 마무리.",b:"이어폰 꽂고 혼자. 아무도 말 안 거는 새벽 루트."},
  {q:"러닝 클럽에 신입이 들어왔다. 당신은?",a:"훈련 끝나기 전에 이름·직업·PR 다 알고 있다.",b:"몇 주 같이 뛰면 자연스럽게 알게 되겠지."},
  {q:"마라톤 30km 지점, 벽이 왔다. 무엇이 당신을 살리는가?",a:"옆 선수, 관중의 함성, 페이스메이커의 존재감.",b:"귀에 꽂힌 플레이리스트와 내 안의 목소리."},
  {q:"훈련 후 저녁, 에너지를 돌려주는 활동은?",a:"SNS에 오늘 런 업로드. 크루 단톡 확인.",b:"조용히 스트레칭. 혼자 먹는 저녁."},
  {q:"'같이 달릴래요?' 메시지가 왔다.",a:"언제요? 어디서요? 좋아요!",b:"(3초 고민) 오늘은 좀... 혼자가 더 좋은데."},
  {q:"대회 전날 밤 9시, 당신은?",a:"숙소에서 다른 참가자들과 탄수화물 파티.",b:"혼자 코스 지도 보며 내일 전략 최종 점검."},
  {q:"힘든 인터벌 훈련 중 도움이 되는 것은?",a:"같이 힘들어하는 파트너의 숨소리.",b:"내 심박수 숫자와 페이스 시계."},
  {q:"새 러닝화를 산다. 구매 과정은?",a:"스택 높이, 드롭, 무게, 리뷰 1000개 정독 후 비교표 작성.",b:"신어보고 발이 '응'하고 반응하면 끝."},
  {q:"달리는 중 머릿속은?",a:"현재 페이스, 심박, 다음 km까지 남은 거리.",b:"'왜 달리는가', '저 산 너머엔 뭐가 있을까'."},
  {q:"코치가 '이번 달은 천천히 달려요'라고 했다.",a:"'심박 130 이하? 말할 수 있는 속도? 정확히 알려주세요.'",b:"'알겠습니다. 느낌으로 가면 되겠죠.'"},
  {q:"훈련 일지 스타일은?",a:"날짜·거리·페이스·심박·날씨 빠짐없이 기록. 스프레드시트 정리.",b:"'오늘 좋았음', '다음엔 더 멀리'. 느낌 중심."},
  {q:"대회 3일 전, 확인하는 것은?",a:"배번표 수령, 출발 시간, 화장실 위치, 보급소 km.",b:"'아, 일요일이구나. 토요일에 슬슬 준비해야지.'"},
  {q:"폼 교정 영상을 봤다. 당신은?",a:"오늘 당장 착지 위치 센티미터 단위로 조정 시도.",b:"'흥미롭네. 이 원리를 내 훈련 철학에 어떻게 녹일까?'"},
  {q:"트레일 도중 길이 두 갈래다. 표지판 없음.",a:"GPS 켜고 코스 확인. 시계 지도 체크.",b:"오른쪽이 왠지 더 좋아 보인다. 감으로 간다."},
  {q:"달리기를 지속하는 근본 이유는?",a:"건강 지표, 체중 관리, 기록 단축이라는 구체적 성과.",b:"달리면서 내가 더 나다워지는 것 같아서."},
  {q:"친구가 '오늘 20km 못 뛸 것 같아'라고 한다.",a:"'오늘 훈련 목적이 뭔지, 얼마나 대체 가능한지' 물어본다.",b:"'많이 힘들겠다. 오늘은 쉬어. 커피나 마시자.'"},
  {q:"35km 지점, 무릎이 아프다. 완주 포기할지 고민이다.",a:"부상 악화 확률과 완주 가능성을 빠르게 계산.",b:"가족이 결승선에서 기다린다. 어떻게든 간다."},
  {q:"달리는 가장 큰 이유는?",a:"VO₂max 향상, 연간 2000km 달성 같은 측정 가능한 목표.",b:"달리고 나면 기분이 나아지고 삶이 달라지는 느낌."},
  {q:"부상 조언 글에 댓글을 단다면?",a:"'최신 연구는 RICE보다 POLICE 프로토콜을 지지합니다.'",b:"'많이 아프시겠다. 얼른 나으세요. 비슷한 경험이...'"},
  {q:"첫 완주 후 밤 11시, 당신은?",a:"구간별 페이스 분석. 다음 대회 목표 설정.",b:"가족·친구에게 전화해서 오늘 느낌을 한참 이야기."},
  {q:"느린 러너가 '어떻게 하면 빨라질 수 있어요?'라고 묻는다.",a:"'주간 km 몇이에요? LT 훈련부터 추가해봐요.'",b:"'왜 달리세요? 어떤 부분이 힘드세요?' 먼저 공감."},
  {q:"훈련 그룹에서 자연스러운 역할은?",a:"페이스 계산, 훈련 계획, 데이터 피드백.",b:"분위기 만들기, 힘든 사람 챙기기, 같이 기뻐하기."},
  {q:"비 오는 날 훈련 계획이 있다.",a:"'비는 그냥 물이다. 오늘 계획 실행.'",b:"'오늘은 왠지 쉬어야 할 것 같다. 요가로 대체.'"},
  {q:"12주 훈련 프로그램을 받았다. 당신은?",a:"달력에 모두 표시. 빠지면 보충 계획 즉시 수립.",b:"참고는 하되 컨디션·날씨에 따라 자유롭게 조정."},
  {q:"대회 3개월 전 상태는?",a:"등록 완료. 교통·숙소 예약 완료. 훈련 계획 확정.",b:"'3개월 남았구나. 이제 슬슬 등록해볼까. 마감 아직이지?'"},
  {q:"오늘 20km 훈련인데 갑자기 비가 쏟아진다.",a:"미리 챙겨둔 방수 재킷 입고 출발. 비도 훈련이다.",b:"'오, 비네. 수영장이나 유튜브 요가로 때우자.'"},
  {q:"훈련 일지를 보면?",a:"지난 3년 모든 훈련이 날짜별로 정리. 월간 km 그래프.",b:"'훈련 일지? 가끔 기억날 때 적는데요.'"},
  {q:"레이스 당일 페이스 전략은?",a:"5km 구간별 목표 페이스 시계에 입력 완료.",b:"'일단 뛰어보면서 몸 상태 보고 결정하죠.'"},
  {q:"훈련을 하루 빠졌다. 기분은?",a:"찜찜하다. 주간 계획이 틀어졌다. 어떻게 보충하지?",b:"'몸이 쉬라는 신호겠지. 내일 더 하면 되지.'"},
  {q:"완주 메달, 집에 돌아오면?",a:"이미 정해둔 자리에 걸기.",b:"일단 책상 위에 던져두고... 6개월 후 서랍에서 발견."},
  {q:"트레일 중 예정 코스 옆에 아무도 안 간 멋진 길이 보인다.",a:"코스에서 이탈하면 GPS 기록이 달라진다. 계획대로.",b:"저 길 무조건 가봐야 해. 오늘 계획? 나중에 생각!"},
];

const DIMS = ['에너지 방향 (E·I)', '정보 수집 (S·N)', '의사결정 (T·F)', '생활 양식 (J·P)'];

const PACE_LABELS: Record<string,string> = {
  fneg:'강제 네거티브 스플릿',
  even:'이븐 스플릿 (정밀 페이스)',
  kip:'전략적 네거티브 (키프초게 모델)',
  rpe:'RPE 기반 이븐 스플릿'
};
const PACE_CLASS: Record<string,string> = {fneg:'fneg',even:'even',kip:'neg',rpe:'rpe'};
const PACE_DESC: Record<string,string> = {
  fneg:'흥분하기 쉬운 외향형·즉흥형 러너에게 권장. 초반 4–5% 의도적 억제 → 후반 가속. 레이스 초반 군중 에너지에 반응해 오버페이스 하는 성향을 사전에 차단합니다.',
  even:'계획 준수력이 높고 데이터를 꼼꼼히 모니터링하는 러너에게 최적. 전 구간 ±3초/km 이내 유지. 심박과 페이스를 지속 체크하며 일관된 리듬을 만듭니다.',
  kip:'장기 목표 지향, 지연 만족 능력이 있는 유형에게 최적. 전반 의도적 억제 → 중반 안정 → 후반 가속의 3단계 전략. 세계 기록 경신 마라톤의 대다수가 이 패턴을 따릅니다.',
  rpe:'신체 감각이 예민하고 현재 순간에 집중하는 유형에게 최적. GPS 시계보다 몸의 신호(체감 강도 RPE)를 기준으로 달립니다. 엘리트 선수들도 이 방법을 사용합니다.'
};

// ─── FULL TYPE DATA (원본 100% 동일) ───
const TD: Record<string,any> = {
  INTJ:{nm:'설계자형 러너',tag:'나는 이미 2년 후 목표 대회를 정해뒀다',
    sys:'Daniels — VDOT 정밀 처방형',
    sysDetail:'5가지 훈련 강도(Easy/M-pace/Threshold/Interval/Repetition)를 VDOT 지수에 따라 정밀 배분합니다. 목표 기록 기반으로 각 강도의 페이스를 계산하고, 매 4–6주마다 VDOT를 재측정해 훈련을 업그레이드합니다.',
    week:[{n:'월',t:'REST',d:'완전 휴식'},{n:'화',t:'인터벌',d:'400m×10'},{n:'수',t:'Easy',d:'14km'},{n:'목',t:'역치',d:'T페이스 5km×2'},{n:'금',t:'Easy',d:'10km'},{n:'토',t:'M페이스',d:'20km'},{n:'일',t:'장거리',d:'30–35km'}],
    train:[
      '<strong>12–24주 매크로사이클</strong>을 직접 설계합니다. 베이스 빌딩 → 강도 강화 → 테이퍼의 3단계 구조.',
      '<strong>VDOT 기반 5강도 훈련:</strong> Easy(E) / 마라톤페이스(M) / 역치(T) / 인터벌(I) / 반복(R)을 목적에 맞게 배분.',
      '혼자 훈련이 최적. 타인의 페이스에 흔들리지 않고 계획을 정확히 실행합니다.',
      '훈련 데이터(심박, 페이스, HRV)를 스프레드시트로 추적하고 패턴을 분석합니다.',
      '부상 예방도 시스템화. 매 4주차를 회복 주(볼륨 40% 감소)로 달력에 고정합니다.',
    ],
    paceType:'kip',
    race:[
      '<strong>키프초게 모델(전략적 네거티브 스플릿)</strong>이 가장 적합합니다. 전반 의도적 억제 → 중반 안정 → 후반 가속.',
      '구간별 목표 페이스를 GPS 시계에 사전 입력. 군중 흥분에 흔들리지 않는 냉정한 페이스 관리.',
      '0–10km: 목표 평균보다 5–8초/km 느리게 출발. 10–30km: 목표 페이스 정확 유지. 30km 이후: 1–2초/km 서서히 가속.',
      '레이스 당일 기온·습도·코스 고도에 따른 페이스 보정값을 사전에 계산해둡니다.',
      '레이스 중 다른 선수의 페이스나 응원에 흔들리지 않는 유형. 계획이 곧 전략.',
    ],
    nutri:[
      '레이스 중 젤 타이밍과 수분 전략을 사전에 치밀하게 계산합니다. (45–50분 간격, 체중 기반)',
      '새로운 영양 전략은 반드시 장거리 훈련 중 먼저 테스트. 레이스 당일 첫 시도 절대 금지.',
      '탄수화물 로딩: 레이스 48–36h 전 8–10g/kg/일. 평소 먹던 음식만 사용.',
      '레이스 2–3h 전 식사: 흰쌀밥+계란 or 식빵+바나나 (탄수화물 1.5–2g/kg).',
      'Sub 3:30 목표라면 glucose:fructose 2:1 혼합 젤로 60g/h 이상 섭취 권장.',
    ],
    rec:[
      '회복도 시스템화. 운동 후 24h/48h/72h 회복 체크포인트를 설정합니다.',
      '매일 아침 안정 시 심박수를 측정해 과훈련 조기 감지. 평소보다 7회 이상 높으면 즉시 강도 낮춤.',
      'HRV(심박 변이도) 앱(HRV4Training 등) 활용을 강력 추천. 데이터 기반 회복 판단.',
      '수면 7–9시간 확보. 수면 중 성장호르몬이 집중적으로 분비됩니다.',
      '7일 훈련 후 1일 완전 휴식(7+1 법칙)을 훈련 계획에 명시적으로 포함.',
    ],
    trap:[
      '계획 집착으로 컨디션 나쁜 날도 강행 → 오버트레이닝 증후군 위험.',
      '기대 기록 미달 시 자기 비판이 과도해져 회복을 방해하는 악순환.',
      '레이스 중 예상치 못한 변수(날씨, 코스 변경)에 심리적 적응이 느린 편.',
      '회복 기간을 "비효율"로 인식해 충분한 휴식을 취하지 않으려 하는 경향.',
    ],
    best:['ENFJ','ISFJ'],bestWhy:['감정적 에너지와 지지를 제공, 혼자 달리는 INTJ에게 팀 활력을 불어넣음','세부 실행력이 높아 INTJ의 큰 그림 전략을 함께 달성'],
    care:['ESFP','ENFP'],careWhy:['즉흥성과 에너지 넘치는 ESFP는 INTJ의 정밀한 훈련 계획과 충돌 잦음','열정 사이클이 들쑥날쑥한 ENFP와 장기 훈련 파트너십 유지가 어려울 수 있음']},

  INFJ:{nm:'예언자형 러너',tag:'달리면서 삶의 답을 찾는다',
    sys:'Daniels × Lydiard 혼합 — 의미 기반 훈련형',
    sysDetail:'Lydiard의 유산소 기반 철학(느리게 많이, 자연 속에서)을 토대로, 목표 레이스가 다가올 때 Daniels의 역치·인터벌 훈련을 단기 집중 도입합니다. 의미와 구조의 균형을 추구합니다.',
    week:[{n:'월',t:'REST',d:'완전 휴식'},{n:'화',t:'Easy',d:'12km'},{n:'수',t:'역치',d:'T페이스 4km'},{n:'목',t:'Easy',d:'10km'},{n:'금',t:'REST/요가',d:'적극 회복'},{n:'토',t:'Easy',d:'16km'},{n:'일',t:'장거리',d:'24–28km'}],
    train:[
      '<strong>Easy 페이스 런이 명상의 기능</strong>을 합니다. 달리면서 생각을 정리하고 내면을 탐구하는 시간으로 활용.',
      '목표에 의미가 부여될 때 Threshold 훈련도 높은 준수율을 보입니다.',
      '훈련 일지에 수치뿐 아니라 심리 상태도 함께 기록하면 패턴 파악에 큰 도움.',
      '자연 속 트레일러닝이 유산소 기반 구축과 심리 회복을 동시에 달성하는 최적 방법.',
      '훈련의 "왜"를 잃으면 동기가 급격히 떨어집니다. 레이스 의미를 주기적으로 재확인할 것.',
    ],
    paceType:'kip',
    race:[
      '<strong>전략적 네거티브 스플릿</strong>이 이 유형에 자연스럽게 맞습니다. 장기 비전과 의지력이 페이스 억제를 가능하게 합니다.',
      '0–15km: 대화 가능한 수준으로 억제. 15–30km: 목표 페이스 안착. 30km 이후: 의미와 감정 에너지로 가속.',
      '준비한 개인 만트라(나만의 문구)를 30km 이후 힘든 구간에서 꺼내 사용합니다.',
      '응원받는 구간에서 에너지가 급상승합니다. 가족·친구 응원 포인트를 사전에 파악해두세요.',
      '레이스 중 감정적 동력이 후반 페이스를 지탱하는 핵심 연료입니다.',
    ],
    nutri:[
      '감정 상태가 소화에 직접 영향을 미칩니다. 대회 전날 불안이 높으면 소화 문제에 주의.',
      '레이스 전날: 익숙하고 소화 부담 없는 음식만. 새로운 식품은 절대 당일 첫 시도 금지.',
      '규칙적인 식사 루틴이 훈련 일관성에 기여합니다. 뜬구름 잡는 식단보다 패턴화된 식사.',
      '레이스 중 45–50분 간격으로 젤 섭취. 처음 시도하는 젤 브랜드는 사전에 훈련 중 테스트.',
    ],
    rec:[
      '대회 후 1–2일은 완전 휴식이 필수. 감정적 소진이 신체 회복에 큰 영향을 미칩니다.',
      '혼자만의 조용한 회복 시간 확보. 레이스 후 SNS 활동은 에너지를 추가 소진시킵니다.',
      '저널링이 회복과 다음 훈련 계획의 가교. 오늘 느낀 것을 글로 쓰면 심리 회복 가속.',
      '7–9시간 수면 확보. 수면 부족은 부상 위험을 크게 높입니다.',
    ],
    trap:[
      '훈련의 의미를 잃으면 갑작스럽고 강렬한 동기 상실이 옵니다.',
      '"완벽한 훈련 조건"을 기다리다 훈련 공백이 길어지는 경향.',
      '타인의 고통에 과도하게 감정 이입해 자신의 레이스 페이스를 포기하기도 함.',
    ],
    best:['INTJ','ISFP'],bestWhy:['논리적 구조를 제공해 직관을 현실화, 서로 보완적인 강점','감각적 경험을 공유하는 자연 속 트레일 런 파트너'],
    care:['ESTP','ESTJ'],careWhy:['ESTP의 즉흥적이고 경쟁적인 에너지가 INFJ의 내면 집중을 방해','ESTJ의 지나친 시스템화 요구가 INFJ의 직관적 훈련 방식과 충돌']},

  ENTJ:{nm:'지휘관형 러너',tag:'목표 없는 달리기는 달리기가 아니다',
    sys:'Daniels — 경쟁 지향 고강도형',
    sysDetail:'Interval·Threshold 훈련을 중심으로 경쟁 환경에서 퍼포먼스를 극대화합니다. VDOT 업데이트를 통해 훈련 강도를 지속적으로 상향 조정하며, 그룹 훈련 리더 역할이 자연스럽게 주어집니다.',
    week:[{n:'월',t:'REST',d:'완전 휴식'},{n:'화',t:'인터벌',d:'1km×6'},{n:'수',t:'Easy',d:'12km'},{n:'목',t:'역치',d:'T페이스 6km'},{n:'금',t:'Easy',d:'10km'},{n:'토',t:'M페이스',d:'18km'},{n:'일',t:'장거리',d:'28–32km'}],
    train:[
      '<strong>Interval(I)·Threshold(T) 훈련</strong>에서 가장 강점을 발휘합니다. 경쟁자가 있는 훈련 상황에서 퍼포먼스 20% 이상 향상.',
      '스스로 코치 역할을 합니다. 그룹 훈련 리더로서 팀 전체 VDOT 향상을 주도.',
      '효율 중심 훈련: 가장 짧은 시간에 가장 높은 효과를 내는 훈련 조합을 추구.',
      '훈련 일지·데이터 추적 시스템을 직접 구축하고 성과 지표(월간 km, VDOT 변화)를 수치로 관리.',
      '경쟁 시즌에는 VDOT를 매달 측정해 훈련 강도를 지속적으로 업그레이드.',
    ],
    paceType:'kip',
    race:[
      '<strong>전략적 네거티브 스플릿 — 경쟁자 추월 전략</strong>. 레이스 전 경쟁자의 기록을 파악하고 전략을 수립합니다.',
      '0–10km: 의도적 억제. 경쟁 심리를 억누르는 것이 이 구간의 최대 도전.',
      '10–30km: 목표 페이스 정밀 유지. 경쟁자와 간격을 의식하되 흔들리지 않음.',
      '30km 이후: 체계적 가속. 연령대 순위·코스 기록 경신에 강한 동기부여.',
      '⚠️ 초반 오버페이스 위험이 가장 높은 유형. GPS 심박 알람 155bpm 이하로 설정 필수.',
    ],
    nutri:[
      '최소 열량으로 최대 퍼포먼스를 추구합니다. 체중당 탄수화물 섭취량을 계산하는 타입.',
      '레이스 중 젤 타이밍을 최적화. Sub 3:30은 30분 간격, Sub 4:00은 35–40분 간격.',
      '회복 영양(단백질·수분)을 "비효율"로 느껴 소홀히 하는 경향 → 의식적으로 챙길 것.',
      '훈련 후 30분 이내: 탄수화물 + 단백질 3:1 비율. 초콜릿 우유 500mL도 효과적.',
    ],
    rec:[
      '회복을 "약함"이 아닌 "다음 사이클 준비"로 프레이밍하면 실행률이 올라갑니다.',
      '충분한 수면(7–9h)이 퍼포먼스에 가장 강력한 단일 변수임을 데이터로 수용할 것.',
      '냉수욕(10–15°C, 10분)은 고강도 훈련 후 근육 염증 감소에 효과적. "장비"로 인식하면 좋음.',
      '매 4주마다 볼륨 40% 감소 주를 계획에 공식 포함. 회복 없이 쌓기만 하면 무너집니다.',
    ],
    trap:[
      '부상 중 강행 → 장기 이탈 → 목표 전체 무산. 가장 흔한 실패 패턴.',
      '기대 이하 기록 시 타인·환경 탓 경향. 데이터 기반 자기 분석으로 전환 필요.',
      '팀원에게 기대 수준이 높아 그룹 내 갈등을 만들 수 있음.',
    ],
    best:['INTJ','ISTP'],bestWhy:['전략적 비전을 공유하고 훈련 시스템을 함께 구축하는 최고의 파트너','ISTP의 즉흥 대처 능력이 ENTJ의 경직된 계획의 빈틈을 채워줌'],
    care:['INFP','ISFP'],careWhy:['INFP의 감성 중심·비구조적 훈련 방식이 ENTJ의 시스템 지향과 지속적으로 충돌','ISFP의 아름다움 추구와 ENTJ의 효율 추구가 훈련 목적 자체에서 맞지 않음']},

  ENFJ:{nm:'선생님형 러너',tag:'내가 완주해야 다른 사람도 이끌 수 있다',
    sys:'Daniels × 공동체 훈련 결합형',
    sysDetail:'Daniels의 T페이스(역치) 훈련을 그룹과 함께 수행할 때 최고 효율을 냅니다. 다른 사람의 목표 달성을 돕는 과정이 자신의 훈련 의욕을 동시에 높이는 특성을 활용합니다.',
    week:[{n:'월',t:'REST',d:'완전 휴식'},{n:'화',t:'그룹 역치',d:'T페이스 4km'},{n:'수',t:'Easy',d:'12km'},{n:'목',t:'Easy/요가',d:'10km'},{n:'금',t:'REST',d:'—'},{n:'토',t:'그룹 런',d:'18–22km'},{n:'일',t:'장거리',d:'26–30km'}],
    train:[
      '<strong>그룹 T페이스 런</strong>에서 에너지가 폭발합니다. 팀 분위기가 역치 강도를 자연스럽게 유지시켜 줍니다.',
      '다른 사람 목표 달성을 도울 때 자신의 훈련 의욕도 동반 상승하는 독특한 특성 활용.',
      '러닝 클럽 코치·페이스메이커 역할이 훈련과 기여를 동시에 충족.',
      '훈련 계획은 있지만 팀원의 필요에 맞게 유연하게 조정하는 능력도 뛰어납니다.',
      '팀원이 부재한 솔로 훈련 기간에 동기 유지 전략이 필요합니다.',
    ],
    paceType:'kip',
    race:[
      '<strong>전략적 네거티브 스플릿 — 의미 기반 완주 전략</strong>. "이 완주가 누군가에게 의미 있다"는 생각이 원동력.',
      '0–15km: 팀 에너지를 흡수하되 페이스는 억제. 팀 리더가 먼저 안정감을 보여줍니다.',
      '20–35km: 응원 구간에서 폭발적 에너지. 이름을 불러주는 응원이 속도를 높입니다.',
      '자선 달리기·페이스버디 레이스·릴레이 마라톤에서 최고의 퍼포먼스를 냅니다.',
      '⚠️ 다른 선수를 돕다 자기 페이스를 잃는 것을 의식적으로 경계해야 합니다.',
    ],
    nutri:[
      '팀 식사와 공동 회복 루틴이 자신의 영양 전략을 지속시키는 가장 효과적인 장치.',
      '보급소에서 타인을 챙기다 자기 보급을 놓치지 않도록 → 젤을 미리 복장에 부착해둘 것.',
      '레이스 전날: 팀 카보로딩 파스타 디너가 영양 전략의 일부이자 심리 준비.',
      '레이스 후 즉시(30분 이내): 탄수화물·단백질 보충. 팀과 함께 식사하면 더 잘 챙기는 타입.',
    ],
    rec:[
      '대회 후 팀과의 식사·대화가 가장 효과적인 회복 방법입니다.',
      '회복 기간에도 그룹 Easy 런 참여 권장. 혼자 쉬면 오히려 회복이 느립니다.',
      '타인을 배려하느라 자신의 회복을 소홀히 하는 경향을 의식적으로 극복할 것.',
      '갈등 상황에서 과도한 에너지 소비 → 감정 소진이 신체 회복을 방해함을 인지.',
    ],
    trap:[
      '타인 배려로 자신의 페이스 기준을 잃고 타인의 속도에 끌려가는 경우 빈번.',
      '이미 지친 상태에서도 팀 분위기 위해 강행하다 번아웃.',
      '팀 분위기가 나쁠 때 자신의 컨디션도 동반 하락하는 경향.',
    ],
    best:['INTJ','ISTJ'],bestWhy:['INTJ의 전략을 팀에 전파하고 실행하는 완벽한 시너지','안정적 실행력으로 ENFJ의 비전을 현실화하는 파트너'],
    care:['ISTP','INTP'],careWhy:['ISTP의 독립적이고 과묵한 훈련 방식이 공동체 중심인 ENFJ와 에너지 조율이 어려움','INTP의 분석 우선·감정 표현 부족이 ENFJ의 관계 중심 훈련 문화와 충돌']},

  INTP:{nm:'논리학자형 러너',tag:'러닝의 최적 공식을 찾고 있는 중',
    sys:'Lydiard — 이론 탐구형 유산소 기반',
    sysDetail:'왜 유산소 기반이 먼저인지 생리학적으로 이해한 뒤 실행합니다. Lydiard의 4단계 주기화(유산소→언덕→인터벌→피킹)를 개인화해 적용하되, 이론 분석에 빠져 실제 훈련량이 부족해지는 함정을 주의해야 합니다.',
    week:[{n:'월',t:'REST',d:'완전 휴식'},{n:'화',t:'Easy',d:'12km'},{n:'수',t:'Easy',d:'10km'},{n:'목',t:'파틀렉',d:'실험적 런'},{n:'금',t:'REST',d:'—'},{n:'토',t:'Easy',d:'18km'},{n:'일',t:'장거리',d:'22–26km'}],
    train:[
      '<strong>VDOT 이론을 깊이 탐구</strong>한 뒤 적용합니다. 운동생리학, 바이오메카닉스에 자발적으로 파고드는 유형.',
      'Lydiard 초기 유산소 기반 단계(10–16주 저강도 고마일리지)를 "왜?"를 이해하고 나면 충실히 실행.',
      '인터벌 훈련 변형(피라미드 인터벌, 파틀렉)을 스스로 설계하고 실험합니다.',
      '훈련 데이터를 자체 분석. 특히 HRV와 안정 시 심박 추이에 깊은 관심.',
      '⚠️ 이론 분석에 빠져 실제 훈련량이 줄어드는 함정을 항상 경계할 것.',
    ],
    paceType:'rpe',
    race:[
      '<strong>RPE(체감 강도) 기반 이븐 스플릿</strong>이 가장 적합합니다. GPS보다 몸의 신호를 분석하며 달리는 유형.',
      '레이스를 "가설 검증"으로 접근합니다. "이 페이스 전략이 실제로 작동하나?"',
      '0–20km: RPE 12–13(보통 힘든 느낌) 유지. 20–35km: RPE 13–14. 35km 이후: RPE 15–16.',
      '레이스 중 분석에 빠져 페이스 관리를 소홀히 하는 경향 → km별 알람 사전 설정 필수.',
      '후반부 갑작스러운 가속 시도(남은 에너지 재계산 후)가 장기가 되면 큰 무기가 됩니다.',
    ],
    nutri:[
      '영양에 대한 이론은 풍부하지만 레이스 당일 실행이 엉성해지는 경향에 주의.',
      '훈련 중 젤 전략을 미리 테스트하고 표준화하는 것이 핵심 과제. 실험 정신을 여기에 적용.',
      '위장 트러블이 잦다면 glucose 단독 젤(fructose 함량 낮은 것)로 전환.',
      '카페인 젤(100–150mg): 레이스 70% 지점(마라톤 기준 약 30km)에서 효과 최적.',
    ],
    rec:[
      '회복 생리학을 공부하면 루틴 준수율이 급격히 높아지는 유형입니다.',
      'HRV 모니터링(HRV4Training, Elite HRV)이 데이터 기반 회복 판단에 딱 맞습니다.',
      '폼롤러 사용 원리(근막 이완 메커니즘)를 이해하면 꾸준히 사용하게 됩니다.',
      '회복 기간에 다음 시즌 훈련 계획을 구상하면 에너지를 생산적으로 전환 가능.',
    ],
    trap:[
      '너무 많은 방법을 동시에 실험해서 기준이 흔들리고 성장 방향을 잃음.',
      '루틴 유지 실패로 훈련량이 불규칙해지는 악순환.',
      '레이스 당일 새로운 젤·전략 시도 → 예상치 못한 위장 부작용.',
    ],
    best:['ENTJ','ISTJ'],bestWhy:['INTP의 분석을 실행으로 이끄는 강력한 추진력','꼼꼼한 실행력으로 이론을 현실화하는 안정적 파트너'],
    care:['ESFJ','ESFP'],careWhy:['ESFJ의 공동체 중심 훈련이 INTP의 독립적 분석 시간을 방해','ESFP의 즉흥적 파티 에너지가 INTP의 훈련 집중력을 깨뜨리는 경우 많음']},

  INFP:{nm:'중재자형 러너',tag:'나는 달리면서 나답게 살고 있다',
    sys:'Lydiard — 자연 탐험형 유산소 기반',
    sysDetail:'의미와 자연 속에서 고마일리지를 쌓는 Lydiard 철학과 가장 잘 맞습니다. "달리는 이유"가 명확할 때 놀라운 장거리를 소화합니다. 트레일러닝이 이상적인 훈련 환경입니다.',
    week:[{n:'월',t:'REST',d:'완전 휴식'},{n:'화',t:'Easy',d:'10km'},{n:'수',t:'트레일',d:'12–16km'},{n:'목',t:'Easy',d:'8km'},{n:'금',t:'REST',d:'—'},{n:'토',t:'탐험런',d:'새 코스'},{n:'일',t:'장거리',d:'20–26km'}],
    train:[
      '의미 있는 목표가 있을 때 놀라운 고마일리지를 달성합니다. "이 대회가 왜 중요한가"를 주기적으로 확인.',
      '<strong>자연 속 트레일러닝</strong>이 Lydiard 기반 구축의 이상적 형태. 아름다운 코스가 달리는 의욕을 만듭니다.',
      '강요된 훈련에는 거부 반응. 자발적 달리기에서 폭발적 에너지가 나오는 유형.',
      '창의적인 루트 탐험과 새로운 코스 발견이 훈련 지속의 원동력.',
      '목표 레이스 전 6–8주에 Daniels Easy + Threshold 훈련을 단기 집중 도입하면 효과적.',
    ],
    paceType:'rpe',
    race:[
      '<strong>RPE 기반 이븐 스플릿</strong>. GPS보다 현재 몸의 감각에 집중하며 달리는 유형.',
      '아름다운 코스, 감동적인 순간(석양, 함성)에서 초인적 에너지가 발휘됩니다.',
      '"이 완주의 이유"를 레이스 전날 글로 써두고 30km 이후 힘들 때 꺼내 읽기.',
      '트레일러닝·울트라마라톤에서 두드러지는 유형. 장거리일수록 내면 여정이 깊어짐.',
      '도심 로드 레이스보다 자연 경관이 있는 코스에서 확연히 더 좋은 기록을 냅니다.',
    ],
    nutri:[
      '감정 상태가 식욕과 소화에 직접 영향을 미칩니다. 스트레스 높을 때 소화 민감도 상승.',
      '음식에 가치를 연결하는 경향(채식·로컬 푸드 선호). 레이스 전엔 소화 부담 최소화.',
      '레이스 전날: 절대적으로 익숙한 음식만. 새로운 음식 실험은 훈련 중에만.',
      '트레일 레이스: 젤 외에 바나나·감자·오렌지 같은 자연 식품을 보급소에서 활용.',
    ],
    rec:[
      '혼자만의 조용한 회복 시간이 필수입니다. 대회 후 SNS는 에너지를 추가 소진시킵니다.',
      '자연 속 가벼운 산책이 최고의 회복. 달리지 않아도 자연에 있는 것만으로 회복됩니다.',
      '자기 비판이 강해 실수 후 심리 회복이 느립니다. 회복 자체에 의미를 부여하는 리프레이밍.',
      '좋아하는 활동(독서, 음악, 그림)과 회복을 연결하면 지속성이 높아집니다.',
    ],
    trap:[
      '감정 기복으로 훈련 일관성의 편차가 매우 큰 유형.',
      '외부 압박(타인 기대, 기록 압박)이 느껴지면 달리기 자체가 스트레스로 변함.',
      '기록 목표 없이 달려 장기 성장 방향이 불명확해지는 경향.',
    ],
    best:['ENFJ','ISFP'],bestWhy:['잠재력을 이끌어내는 최고의 지지자이자 응원자','자연과 의미를 함께 찾는 이상적인 트레일 러닝 파트너'],
    care:['ESTJ','ENTJ'],careWhy:['ESTJ의 강압적 시스템화가 INFP의 자발적 달리기 의욕을 소멸시킴','ENTJ의 효율·경쟁 중심 훈련이 의미 중심인 INFP의 달리기 철학과 근본적으로 충돌']},

  ENTP:{nm:'발명가형 러너',tag:'남들이 안 해본 방법으로 달리고 싶다',
    sys:'Lydiard × 실험형 — 개념 검증 훈련',
    sysDetail:'Lydiard 유산소 기반의 "왜?"를 논리적으로 납득한 뒤 실행합니다. 단조로운 기반 구축 기간에는 새 코스·실험적 방법으로 흥미를 유지하고, 목표 레이스 전 Daniels 강도 훈련을 단기 집중 도입합니다.',
    week:[{n:'월',t:'REST',d:'완전 휴식'},{n:'화',t:'파틀렉',d:'즉흥 강도 변화'},{n:'수',t:'Easy',d:'12km'},{n:'목',t:'실험 런',d:'새 방법 테스트'},{n:'금',t:'REST',d:'—'},{n:'토',t:'Easy',d:'16km'},{n:'일',t:'장거리',d:'22–28km'}],
    train:[
      '인터벌 훈련의 변형(피라미드 인터벌, 파틀렉, 빌드업 런)을 직접 설계하고 실험합니다.',
      '"왜 유산소 기반이 먼저인가"를 생리학적으로 이해하면 Lydiard 기반 기간을 충실히 실행.',
      '단조로운 기반 구축 기간에 새로운 코스 탐험·크로스트레이닝으로 흥미를 유지.',
      '핵심 훈련(Easy + Threshold)이 소홀해지지 않도록 주의. 실험은 보조 훈련으로만.',
      '여러 대회를 동시에 준비하다 집중력이 분산되는 패턴을 의식적으로 방지.',
    ],
    paceType:'fneg',
    race:[
      '<strong>강제 네거티브 스플릿</strong> 전략이 필요합니다. 즉흥성이 강해 레이스 초반 오버페이스 위험이 매우 높습니다.',
      '0–5km: GPS 알람 설정. 군중 에너지에 반응하지 말고 느리다 싶은 페이스 유지.',
      '10–25km: 목표 페이스 서서히 진입. 아직 에너지가 넘치는 느낌이 드는 게 정상.',
      '25–35km: 이 구간부터 즉흥 전략 발동 허용. 경쟁자 추월·페이스 가속 시작.',
      '35km 이후: 초반에 절약한 에너지를 모두 쏟아내는 구간. 여기서 승부.',
    ],
    nutri:[
      '새로운 영양 전략에 관심은 높지만 레이스 당일 미검증 방법 시도는 절대 금지.',
      '"훈련 중 먼저 테스트" 원칙을 자신만의 룰로 삼을 것. 실험은 레이스가 아닌 훈련에서.',
      '레이스 중 보급 전략을 즉흥으로 바꾸지 말 것. 보급소 전 섭취 계획을 사전에 확정.',
      '전해질: 나트륨 300–600mg/h 보충. 땀이 짜다면 더 많이 보충.',
    ],
    rec:[
      '크로스트레이닝(클라이밍, 자전거, 수영)이 이탈 없이 회복하는 이상적 방법.',
      '회복 기간에 새로운 훈련 방법을 연구하는 시간으로 활용하면 이탈률 감소.',
      '수면 7–9h. 새로운 회복 기술(냉온욕, 마사지 건)에 흥미를 보이는 유형.',
    ],
    trap:[
      '동시에 여러 대회 준비 → 집중력이 분산되어 어느 것도 제대로 못 하는 결과.',
      '시작은 화려하지만 3–4주 후 흥미가 급락하는 열정 사이클.',
      '논쟁하고 새 방법을 탐색하느라 실제 훈련 시간을 잃는 경향.',
    ],
    best:['INTJ','INTP'],bestWhy:['아이디어를 시스템과 계획으로 만들어주는 파트너','지적 실험 정신을 공유하는 최고의 훈련 토론 파트너'],
    care:['ISFJ','ISTJ'],careWhy:['ISFJ의 안정 추구와 정해진 루틴 선호가 ENTP의 즉흥성·실험 정신과 충돌','ISTJ의 엄격한 계획 준수 요구가 ENTP에게 답답함을 주고 관계 갈등으로 이어짐']},

  ENFP:{nm:'활동가형 러너',tag:'달리기가 이렇게 신나는 거였어?',
    sys:'Lydiard — 공동체 에너지형 장거리 기반',
    sysDetail:'그룹 장거리 런이 Lydiard 고마일리지의 원천입니다. 열정 사이클의 고점에 훈련량을 최대화하고, 목표 레이스 전 Daniels T페이스 훈련을 크루와 함께 진행합니다.',
    week:[{n:'월',t:'REST',d:'완전 휴식'},{n:'화',t:'그룹 T',d:'T페이스 4km'},{n:'수',t:'Easy',d:'10km'},{n:'목',t:'Easy',d:'8km'},{n:'금',t:'REST',d:'—'},{n:'토',t:'그룹 런',d:'16–20km'},{n:'일',t:'장거리',d:'22–28km'}],
    train:[
      '<strong>T페이스 런을 크루와 함께</strong> 하면 강도 유지가 자연스러워집니다. 혼자 하면 흐지부지됩니다.',
      '열정 사이클의 고점에 훈련량을 집중 투자하는 전략이 유효.',
      '짧고 명확한 목표("이번 달 월간 200km")가 동기 유지에 더 효과적.',
      '러닝 클럽 분위기를 만드는 사람. 자신의 에너지가 팀 전체 마일리지를 높입니다.',
      '열정이 식으면 새로운 대회 목표나 챌린지를 추가해 재점화하는 전략 사용.',
    ],
    paceType:'fneg',
    race:[
      '<strong>강제 네거티브 스플릿</strong>이 절실합니다. 응원과 분위기에 반응해 초반 오버페이스가 가장 잦은 유형.',
      '0–5km: 느리다 싶을 정도로 억제. 이 구간이 레이스 성패를 가릅니다.',
      '⚠️ GPS 알람 설정 필수: 처음 5km 목표 페이스보다 10–15초/km 느리게 출발.',
      '15–30km: 응원 구간에서 에너지 폭발. 이 구간을 위해 초반을 아꼈습니다.',
      '30km 이후: 팀 에너지, 관중, 이름을 불러주는 응원이 최고의 연료.',
    ],
    nutri:[
      '레이스 당일 아침 식사를 잊어버릴 수 있습니다. 알람 2개 이상 설정. 절대 거르지 않기.',
      '레이스 전날 팀 카보로딩 디너가 영양 전략이자 심리 준비의 일부.',
      '보급소에서 필요한 것을 챙기되 멈추지 않는 습관이 중요. 뛰면서 마시기 연습.',
    ],
    rec:[
      '레이스 후 팀 회식·대화가 최고의 회복입니다.',
      '혼자 쉬면 외로워서 오히려 회복이 안 됩니다. 가벼운 소셜 Easy 런이 Active Recovery.',
      '회복 주간에도 그룹 활동 유지. 다만 강도는 철저히 낮게.',
    ],
    trap:[
      '열정 사이클로 훈련 일관성이 크게 흔들리는 것이 가장 큰 약점.',
      '레이스 등록 후 흥미를 잃어 참가비를 날리는 경우 주의.',
      '레이스 중 옆 선수와 대화하다 페이스를 잃는 경험 반복.',
    ],
    best:['ISTJ','ISFJ'],bestWhy:['구조와 일관성을 제공해 열정을 기록으로 전환','세심한 배려로 컨디션 관리를 도와주는 완벽한 파트너'],
    care:['INTJ','INTP'],careWhy:['INTJ의 정밀한 훈련 계획이 ENFP의 즉흥적 라이프스타일과 지속적으로 마찰','INTP의 이론 중심·낮은 감정 표현이 ENFP의 에너지 넘치는 공동체 훈련 문화와 맞지 않음']},

  ISTJ:{nm:'현실주의자형 러너',tag:'계획한 대로 해야 기분이 좋다',
    sys:'Daniels — 완벽 준수형 정밀 훈련',
    sysDetail:'12–16주 Daniels 프로그램을 단 하루도 빠짐없이 완수하는 유형입니다. VDOT 표대로 각 훈련의 페이스를 철저히 지키고, 과도한 페이스 없이 정확히 실행합니다.',
    week:[{n:'월',t:'REST',d:'완전 휴식'},{n:'화',t:'인터벌',d:'400m×8'},{n:'수',t:'Easy',d:'12km'},{n:'목',t:'역치',d:'T페이스 4km×2'},{n:'금',t:'Easy',d:'10km'},{n:'토',t:'M페이스',d:'18km'},{n:'일',t:'장거리',d:'26–30km'}],
    train:[
      '12–16주 Daniels 프로그램을 <strong>단 하루도 빠짐없이 완수</strong>할 수 있는 유형.',
      'VDOT 표대로 각 훈련의 페이스를 정확히 지킵니다. 과도한 페이스 절대 없음.',
      '비가 와도, 피곤해도, 계획은 계획이다. 훈련 루틴이 가장 안정적인 유형.',
      '훈련 일지를 빠짐없이 기록하고 장기 추이를 분석해 성장을 확인합니다.',
      '검증된 방법(기존 훈련법, 코치 지시)을 신뢰. 실험적 방법에는 시간이 걸립니다.',
    ],
    paceType:'even',
    race:[
      '<strong>이븐 스플릿(정밀 페이스 관리)</strong>이 이 유형의 가장 자연스럽고 효과적인 전략입니다.',
      '구간별 목표 페이스를 사전에 정해 정확히 지킵니다. 전 구간 ±3초/km 이내 관리 목표.',
      '0–10km: 흥분에 흔들리지 않는 냉정함. 이 유형의 가장 큰 강점 발휘 구간.',
      '10–35km: 메트로놈처럼 일관된 페이스. 연구에 따르면 가장 경제적인 패턴.',
      '35km 이후: 이븐 스플릿의 보상 구간. 충분한 에너지가 남아 막판 가속 가능.',
    ],
    nutri:[
      '검증된 영양 전략을 루틴화합니다. 레이스 전날 같은 메뉴를 매번 반복.',
      '새로운 젤 브랜드나 음식은 반드시 훈련 중 먼저 테스트. 레이스 당일 절대 첫 시도 금지.',
      '탄수화물 로딩: 레이스 48h 전부터 시작. 익숙한 음식으로만.',
      '젤 섭취 타이밍을 시계 알람으로 설정. 체계적 보급이 강점.',
    ],
    rec:[
      '회복 주를 미리 달력에 표시해두면 저항감 없이 쉬게 됩니다.',
      '7+1 법칙(7일 훈련 후 1일 완전 휴식)을 훈련 계획의 공식 항목으로 포함.',
      '과훈련 조기 신호: 안정 시 심박수가 평소보다 7회 이상 높으면 즉시 강도 낮춤.',
    ],
    trap:[
      '훈련 환경 변화(여행, 날씨, 장소)에 크게 흔들려 훈련 공백이 생깁니다.',
      '충분한 회복 없이 계획 강행 → 피로 골절, 슬개골건염으로 이어지는 경우.',
      '"계획 = 의무"로 인식해 유연한 조정을 거부하다 번아웃.',
    ],
    best:['ENFP','ENTP'],bestWhy:['ISTJ의 구조가 ENFP의 열정에 방향을 제공하는 완벽한 균형','ISTJ의 루틴이 ENTP의 아이디어를 현실화하는 실행력 조합'],
    care:['ENTP','INTP'],careWhy:['ENTP의 끊임없는 실험과 변칙이 ISTJ의 루틴 기반 훈련 구조를 흔들어 놓음','INTP의 불규칙한 훈련 패턴이 규칙성을 중시하는 ISTJ에게 신뢰 문제를 만듦']},

  ISFJ:{nm:'수호자형 러너',tag:'모두가 무사히 완주하길 바란다',
    sys:'Daniels × 커뮤니티 — 책임감 기반 지속형',
    sysDetail:'운동 파트너와의 약속이 최고의 동기입니다. Daniels Easy 런을 팀원과 함께 진행할 때 가장 잘 작동하며, 그룹 장거리 런을 조직하거나 참여하는 것이 Lydiard 기반 구축의 이상적 형태입니다.',
    week:[{n:'월',t:'REST',d:'완전 휴식'},{n:'화',t:'Easy',d:'10km'},{n:'수',t:'그룹 런',d:'12km'},{n:'목',t:'Easy',d:'8km'},{n:'금',t:'REST',d:'—'},{n:'토',t:'그룹 롱런',d:'18–22km'},{n:'일',t:'장거리',d:'22–26km'}],
    train:[
      '운동 파트너와의 약속이 최고의 동기. <strong>책임감이 훈련 준수율을 높입니다.</strong>',
      '그룹 Easy 런을 조직하거나 참여하는 것이 훈련의 핵심 루틴.',
      '꾸준하고 안정적인 훈련 패턴. 급격한 강도 올리기보다 점진적 발전을 선호.',
      '보급 음식을 꼼꼼히 챙겨가고 팀원 컨디션을 세심하게 파악하는 타입.',
      '자신보다 팀원의 훈련 스케줄을 더 잘 기억하는 경향 → 자신의 계획도 같은 만큼 챙길 것.',
    ],
    paceType:'even',
    race:[
      '<strong>이븐 스플릿 — 완주 경험 자체에 의미</strong>. 기록보다 안전하고 완전한 완주가 목표.',
      '페이스 버디와 함께 달릴 때 최고의 퍼포먼스. 서로를 격려하며 이븐 페이스 유지.',
      '0–20km: 대화 가능한 수준으로 편안하게. 이 구간을 가장 편안하게 달리는 것이 핵심.',
      '응원받는 구간에서 눈물이 날 정도로 감동. 가족·친구 응원 포인트를 미리 파악해 에너지 비축.',
      '35km 이후: 여기까지 달려온 모든 사람들을 위해 끝까지 달립니다.',
    ],
    nutri:[
      '전통적이고 안전한 음식을 선호합니다. 레이스 전날 보급 백 확인 체크리스트 활용.',
      '새로운 보충제 시도에 보수적. 검증된 방법만 사용.',
      '타인의 보급을 챙기다 자신의 섭취 타이밍을 놓치지 않도록 → 젤을 복장에 미리 부착.',
    ],
    rec:[
      '타인을 챙기다 자신의 회복을 소홀히 하는 경향이 <strong>가장 강한 유형</strong>.',
      '"회복 시간 = 나를 위한 시간"으로 의식적으로 허락하는 것이 핵심 과제.',
      '수동적 회복(마사지, 온욕)을 배우자·가족에게 도움을 받는 형태로 진행하면 자연스럽게 이루어짐.',
    ],
    trap:[
      '원치 않는 페이스를 따르다 부상. 자기 페이스를 주장하지 못하는 경향.',
      '갑작스러운 환경 변화(대회 코스 변경, 날씨)에 큰 스트레스.',
      '과도한 배려로 대회 당일 자신의 준비를 제대로 못 하는 경우.',
    ],
    best:['ENTJ','ENFJ'],bestWhy:['조직력과 ISFJ의 배려가 결합한 완벽한 팀 구성','함께 공동체를 이끄는 최고의 조합'],
    care:['ENTP','INTP'],careWhy:['ENTP의 끊임없는 변칙과 실험이 안정을 추구하는 ISFJ에게 불안감을 줌','INTP의 감정 표현 부족과 독립적 성향이 관계를 소중히 여기는 ISFJ에게 거리감을 만듦']},

  ESTJ:{nm:'경영자형 러너',tag:'러닝도 시스템이 있어야 한다',
    sys:'Daniels — 팀 조직형 데이터 관리',
    sysDetail:'Daniels 프로그램을 팀 단위로 조직화합니다. 훈련 일지·데이터 추적 시스템을 직접 구축하고, 러닝 클럽의 리더·코치 역할이 자연스럽게 주어집니다.',
    week:[{n:'월',t:'REST',d:'완전 휴식'},{n:'화',t:'인터벌',d:'1km×5'},{n:'수',t:'Easy',d:'12km'},{n:'목',t:'역치',d:'T페이스 5km'},{n:'금',t:'Easy',d:'10km'},{n:'토',t:'팀 런',d:'18–22km'},{n:'일',t:'장거리',d:'26–32km'}],
    train:[
      'Daniels 프로그램을 팀 단위로 조직화. <strong>러닝 클럽 코치·리더 역할</strong>이 자연스럽게 주어집니다.',
      '훈련 일지·데이터 추적 시스템을 직접 구축. 성과 지표(월간 km, VDOT)를 수치로 관리.',
      '성과 지향적. 명확한 수치 목표(6개월 후 Sub 4:00)가 훈련 동기의 핵심.',
      '규율과 책임감이 그룹 전체의 훈련 준수율을 높입니다.',
    ],
    paceType:'even',
    race:[
      '<strong>이븐 스플릿 — 철저한 사전 준비형</strong>. 대회 규정·코스·보급소 위치를 완벽하게 파악.',
      '레이스 전 코스 분석, 오르막 구간 페이스 손실량을 사전에 계산합니다.',
      '0–10km: 초반 흥분과 경쟁 본능을 시스템으로 억제. 계획이 우선.',
      '연령대 순위, 코스 기록 경신에 강한 동기부여. 순위판이 에너지원.',
      '팀 동반 주자가 있을 때 자연스럽게 페이스를 리드하는 포지션.',
    ],
    nutri:[
      '체중·체지방 데이터를 모니터링하며 영양 계획을 수립합니다.',
      '그룹 내 영양 정보 공유와 전파 역할. 팀 전체의 레이스 전날 식사를 조율.',
    ],
    rec:[
      '마사지, 냉각욕 예약을 미리 달력에 넣어두면 실행 가능성이 높아집니다.',
      '회복 일정을 시스템화. 회복도 훈련 계획의 공식 구성 요소로 포함.',
    ],
    trap:[
      '융통성 부족으로 예상치 못한 상황(코스 변경, 날씨) 대응이 어려움.',
      '팀원에게 기대 수준이 높아 갈등을 만드는 경우.',
      '경쟁에 집중하다 달리기 자체의 즐거움을 잃는 경향.',
    ],
    best:['ISFJ','INFP'],bestWhy:['배려와 조직력이 결합한 최강 팀 구성','ESTJ의 구조가 INFP의 감성에 안정감을 제공'],
    care:['INFP','ISFP'],careWhy:['INFP의 비구조적·감성 중심 훈련이 ESTJ의 시스템 지향과 지속적으로 충돌','ISFP의 아름다움 추구와 현재 몰입이 ESTJ의 효율·목표 중심 훈련과 맞지 않음']},

  ESFJ:{nm:'집정관형 러너',tag:'우리 모두 함께 완주하는 날이 최고다',
    sys:'Lydiard × 공동체 — 파티 분위기형 장거리',
    sysDetail:'그룹 T페이스 런과 장거리 런을 통해 공동체 에너지로 고마일리지를 달성합니다. 팀 분위기를 만드는 것이 훈련의 일부입니다.',
    week:[{n:'월',t:'REST',d:'완전 휴식'},{n:'화',t:'그룹 T',d:'T페이스 3km'},{n:'수',t:'Easy',d:'10km'},{n:'목',t:'Easy',d:'8km'},{n:'금',t:'REST',d:'—'},{n:'토',t:'그룹 롱런',d:'18–22km'},{n:'일',t:'Easy',d:'12km'}],
    train:[
      '그룹 T페이스 런과 페이스 버디 훈련에서 Daniels 강도를 자연스럽게 달성.',
      '팀 분위기를 만들고 조직하는 것이 훈련의 일부. 분위기가 좋으면 훈련이 자연스럽게 이어짐.',
      '팀 전체 마일리지를 높이는 핵심 인물. 자신의 달리기가 팀에 기여한다는 의식.',
    ],
    paceType:'fneg',
    race:[
      '<strong>강제 네거티브 스플릿</strong> 전략 권장. 응원과 파티 분위기에 반응해 초반 오버페이스 위험.',
      '0–5km: 응원과 흥분에 반응하지 않도록 의식적으로 억제. GPS 알람 필수.',
      '응원 구간(보통 20–30km)에서 에너지가 폭발합니다. 응원자 위치 사전 파악.',
      '가족·친구의 이름을 불러주는 응원이 가장 강한 연료. 이 구간을 위해 초반을 아꼈습니다.',
      '주변 선수를 돕다 자기 페이스를 잃는 것을 의식적으로 경계.',
    ],
    nutri:[
      '팀 식사가 영양 전략의 일부. 레이스 전날 팀 카보로딩 파스타 디너를 주최.',
      '자신보다 타인 식사를 챙기다 자신의 타이밍을 놓치지 않도록.',
    ],
    rec:[
      '대회 후 팀 회식으로 회복 시작. 공동체 활동이 회복의 일부.',
      '혼자 쉬는 것보다 그룹 Easy 런이 더 효과적인 타입.',
    ],
    trap:[
      '타인의 기대에 부응하려다 자신을 과훈련 상태로 몰아넣음.',
      '부정적 피드백(팀 갈등, 코치의 지적)에 감정적으로 크게 흔들림.',
      '팀 분위기가 나쁠 때 자신의 컨디션도 동반 하락.',
    ],
    best:['INTJ','ISTP'],bestWhy:['공동체 에너지를 가진 ESFJ가 고독을 좋아하는 INTJ에게 활력을 제공','ISTP의 독립성이 ESFJ의 과의존 경향을 건강하게 방지'],
    care:['INTJ','ISTP'],careWhy:['INTJ의 고독 중심 훈련이 공동체를 중시하는 ESFJ와 훈련 일정 조율에 어려움','ISTP의 과묵함과 독립적 성향이 관계 중심인 ESFJ에게 소외감을 줄 수 있음']},

  ISTP:{nm:'장인형 러너',tag:'몸이 말하는 걸 가장 잘 듣는다',
    sys:'Lydiard — 신체 감각 우선형',
    sysDetail:'Lydiard의 "몸이 준비됐을 때 강도를 높인다" 철학과 가장 잘 맞습니다. 오늘의 신체 상태를 가장 정확하게 읽는 유형으로, 즉흥 강도 조정이 데이터 기반 계획만큼 효과적입니다.',
    week:[{n:'월',t:'REST',d:'완전 휴식'},{n:'화',t:'감각 런',d:'몸 상태 기반'},{n:'수',t:'Easy',d:'10–14km'},{n:'목',t:'기술 런',d:'폼·착지 연습'},{n:'금',t:'REST/스트레칭',d:'적극 회복'},{n:'토',t:'트레일',d:'기술 구간'},{n:'일',t:'장거리',d:'20–26km'}],
    train:[
      '<strong>몸의 신호에 가장 예민하게 반응</strong>하는 유형. 발 착지 패턴, 근육 긴장 위치, 호흡 변화를 즉각 감지.',
      '오늘 몸 상태에 따른 즉흥 강도 조정이 데이터 계획만큼 효과적.',
      '장비 커스터마이징(러닝화 깔창, 드롭 조정)에 깊은 관심과 실험 정신.',
      '트레일 기술 구간에서 본능적 최적 라인 탐색 능력이 탁월.',
      '장기 훈련 계획이 없으면 기반이 부족해집니다. 최소한의 주간 구조를 만들어 둘 것.',
    ],
    paceType:'rpe',
    race:[
      '<strong>RPE 기반 이븐 스플릿</strong>. GPS보다 몸의 신호를 신뢰하고 즉각 대처하는 전략.',
      '0–15km: RPE 11–12 (가볍게 힘든 느낌). 몸이 레이스에 적응하는 구간.',
      '15–30km: RPE 13–14. 이 감각을 기준점으로 유지.',
      '30km 이후: RPE 15–16. 몸이 말하는 것을 들으며 남은 에너지를 정직하게 투입.',
      '위기 상황(경련, 낙상, 길 잃음)에서 침착한 즉흥 대처 능력이 트레일에서 빛납니다.',
    ],
    nutri:[
      '먹는 것보다 회복(냉욕, 마사지, 폼롤러)에 더 집중하는 유형.',
      '저혈당 방지를 위한 최소 섭취 규칙(45분마다 젤 1개)을 사전에 정해두기.',
      '보급 즉흥 결정을 하더라도 나트륨 보충만큼은 계획대로 진행.',
    ],
    rec:[
      '폼롤러, 마사지 건, 냉온욕을 "장비"로 인식해 적극 활용합니다.',
      '신체 회복에 무엇이 필요한지 직관적으로 파악하는 능력이 탁월.',
      '회복 도구를 탐구하는 것 자체가 즐거운 활동이 됩니다.',
    ],
    trap:[
      '장기 훈련 계획 없이 즉흥으로만 달려 유산소 기반이 부족해지는 경향.',
      '컨디션 나쁜 날 훈련을 통째로 건너뛰어 주간 계획이 무너짐.',
      '대회 준비를 마감 직전에 서두르는 패턴. 등록 마감일을 모르고 지나치기도 함.',
    ],
    best:['ENTJ','ESTJ'],bestWhy:['ENTJ의 시스템과 계획이 ISTP에게 방향과 구조를 제공','ESTJ의 계획성이 ISTP의 즉흥성에 일관성을 부여'],
    care:['ESFJ','ENFJ'],careWhy:['ESFJ의 공동체 중심·관계 의존이 독립을 선호하는 ISTP에게 부담이 됨','ENFJ의 감정 표현과 공동체 에너지 요구가 과묵한 ISTP에게 피로감을 줌']},

  ISFP:{nm:'예술가형 러너',tag:'달리는 순간이 아름다우면 그걸로 됐다',
    sys:'Lydiard — 감각 탐험형 자연 기반',
    sysDetail:'아름다운 자연 코스에서 Lydiard 고마일리지를 쌓는 것이 가장 이상적입니다. Easy 런을 경치와 소리에 집중하며 즐기고, 달리는 순간의 감각적 경험이 훈련 지속의 원동력입니다.',
    week:[{n:'월',t:'REST',d:'완전 휴식'},{n:'화',t:'감각 런',d:'10km'},{n:'수',t:'트레일',d:'아름다운 코스'},{n:'목',t:'Easy',d:'8km'},{n:'금',t:'REST/산책',d:'자연 회복'},{n:'토',t:'탐험 런',d:'새 코스 발견'},{n:'일',t:'장거리',d:'18–24km'}],
    train:[
      '<strong>아름다운 코스에서 고마일리지</strong>가 자연스럽게 달성됩니다. 경치가 훈련량을 결정합니다.',
      '감각적 경험(빛, 냄새, 발아래 땅의 촉감)이 달리기의 본질. 트레일러닝이 이상적.',
      'Easy 런을 경치와 소리에 집중하며 즐기는 타입. 페이스 시계보다 감각 우선.',
      '목표 레이스 전 6–8주에 Daniels T페이스 훈련을 감각적으로 이해하면(이 느낌이 역치다!) 효과적.',
      '도심 트랙 훈련보다 자연 언덕 반복이 강도와 경험을 동시에 제공.',
    ],
    paceType:'rpe',
    race:[
      '<strong>RPE 기반 이븐 스플릿 — 감각 주도형</strong>. 아름다운 코스에서 현재 순간에 몰입하며 달립니다.',
      '통증보다 감각에 집중하는 능력이 탁월. 이 능력이 레이스 후반의 핵심 무기.',
      '0–20km: 경치와 분위기를 즐기며 RPE 11–13. 몸이 달아오르게 기다립니다.',
      '20–35km: RPE 13–14. 감각적으로 풍부한 구간(숲길, 경관)에서 에너지 상승.',
      '아름다운 자연 트레일 레이스에서 도심 로드 레이스보다 훨씬 좋은 기록을 냅니다.',
    ],
    nutri:[
      '직관적으로 몸이 원하는 것을 먹습니다. 레이스 전 검증 안 된 새 식품 주의.',
      '트레일 레이스: 바나나·오렌지 같은 자연 식품이 젤보다 소화가 잘 맞는 경우 많음.',
      '플레이팅과 색감 좋은 음식이 식욕과 회복을 동시에 돕는 타입.',
    ],
    rec:[
      '자연 속 가벼운 산책이 최고의 회복. 달리지 않아도 자연에 있는 것만으로 충전.',
      '아름다운 경관이 있는 회복 런이 회복과 영감을 동시에 제공.',
      '요가, 수영, 스트레칭처럼 감각적으로 풍부한 회복 활동이 효과적.',
    ],
    trap:[
      '도심 로드 레이스(아름다운 경관 없음)에서 동기가 급격히 저하됩니다.',
      '감정 기복이 훈련 일관성에 직접 영향을 미치는 유형.',
      '기록 목표 없이 달려 장기 성장 방향이 불명확해지는 경향.',
    ],
    best:['INFJ','INFP'],bestWhy:['감성과 직관을 깊이 공유하는 파트너','자연과 의미를 함께 찾는 이상적 트레일 러닝 동반자'],
    care:['ESTJ','ENTJ'],careWhy:['ESTJ의 시스템화와 효율 추구가 ISFP의 감각적 달리기 철학과 충돌','ENTJ의 경쟁 중심 훈련이 아름다움 추구인 ISFP의 달리기 본질과 맞지 않음']},

  ESTP:{nm:'기업가형 러너',tag:'지금 이 순간, 전력으로',
    sys:'Lydiard — 폭발력 중심형 (단기 기반)',
    sysDetail:'Lydiard 유산소 기반 기간을 최대한 짧게(8–10주) 다양한 코스로 운영합니다. 이후 Repetition(짧은 폭발 스프린트) 훈련을 중심으로 레이스 페이스와 폭발력을 강화합니다.',
    week:[{n:'월',t:'REST',d:'완전 휴식'},{n:'화',t:'스프린트',d:'Rep 200m×12'},{n:'수',t:'Easy',d:'10km'},{n:'목',t:'파틀렉',d:'즉흥 강도'},{n:'금',t:'REST',d:'—'},{n:'토',t:'레이스 시뮬',d:'M페이스 12km'},{n:'일',t:'Easy',d:'16–20km'}],
    train:[
      '<strong>Repetition(짧은 폭발 스프린트)</strong> 훈련에서 가장 강점을 발휘합니다.',
      'Lydiard 기반 기간을 짧게(8–10주), 다양한 코스로 유지해 지루함을 방지.',
      '경쟁자가 눈에 보이면 즉각 반응. 훈련 환경에 경쟁 요소를 도입하면 퍼포먼스 향상.',
      '레이스 시뮬레이션을 자주 삽입. 실전 감각을 유지하는 것이 이 유형에게 핵심.',
      '장기 계획보다 단기 목표(이번 달 스피드 향상)에 집중하는 것이 효과적.',
    ],
    paceType:'fneg',
    race:[
      '<strong>강제 네거티브 스플릿</strong>이 가장 절실한 유형입니다. 레이스 초반 아드레날린이 가장 위험한 적.',
      '0–5km: GPS 알람 155bpm 이하. "느리다"는 느낌이 드는 게 정상입니다.',
      '⚠️ 초반 오버페이스가 30km 이후 완전한 붕괴로 이어지는 경험을 반복하는 유형.',
      '10–25km: 에너지가 넘치는 느낌. 이 구간을 꾹 참는 것이 레이스의 핵심 기술.',
      '30km 이후: 드디어 경쟁자를 하나씩 추월하는 드라마 구간. 이것이 강제 네거티브의 보상.',
    ],
    nutri:[
      '보급소에서 즉흥 결정하는 경향 → 최소한의 규칙(45분마다 젤 1개)만 사전에 정해두기.',
      '운동 후 즉각 회복 식사(단백질+탄수화물)가 강한 동기부여 역할.',
      '레이스 중 카페인 젤(30km 이후)이 이 유형의 초반 억제 피로를 극복하는 데 효과적.',
    ],
    rec:[
      '아이스 배스, 마사지 건, NormaTec을 "최신 장비"로 인식해 적극 활용.',
      '쉬는 날에도 뭔가 하고 싶은 욕구 → Active Recovery(수영, 자전거)로 전환.',
      '부상 신호를 무시하고 강행하는 경향이 가장 강한 유형. 데이터로 부상 신호를 객관화할 것.',
    ],
    trap:[
      '초반 오버페이스 후 30km에서 무너지는 패턴을 매 대회 반복.',
      '즉흥성으로 훈련 일관성 부족. 피크 없는 훈련이 지속될 위험.',
      '부상 신호를 무시하고 강행하는 경향이 가장 강합니다.',
    ],
    best:['ISTJ','ISFJ'],bestWhy:['ISTJ의 구조가 ESTP의 즉흥성에 지속성을 부여','ISFJ의 세심한 배려가 과열된 경쟁심을 식혀주는 역할'],
    care:['INFJ','INFP'],careWhy:['INFJ의 내면 집중·조용한 훈련이 ESTP의 폭발적 에너지와 완전히 다른 리듬','INFP의 감성·의미 추구와 ESTP의 즉각적 행동·경쟁 중심이 근본적으로 충돌']},

  ESFP:{nm:'연예인형 러너',tag:'달리기는 파티다. 나는 파티를 즐긴다',
    sys:'Lydiard — 파티 에너지형 공동체 기반',
    sysDetail:'달리기 자체를 파티로 만드는 능력이 팀 전체 마일리지를 높입니다. 그룹 장거리 런이 Lydiard 고마일리지의 원천이며, 레이스 분위기를 흡수해 퍼포먼스로 전환합니다.',
    week:[{n:'월',t:'REST',d:'완전 휴식'},{n:'화',t:'그룹 런',d:'신나는 코스'},{n:'수',t:'Easy',d:'10km'},{n:'목',t:'Easy',d:'8km'},{n:'금',t:'REST',d:'—'},{n:'토',t:'파티 런',d:'그룹 장거리'},{n:'일',t:'Easy',d:'14–18km'}],
    train:[
      '달리기 자체를 파티로 만드는 능력이 팀 전체 마일리지를 높입니다.',
      '그룹 T페이스 런에서 분위기를 만들어 팀 전체 강도를 자연스럽게 향상.',
      '<strong>러닝 크루 분위기 메이커</strong>. 자신의 에너지가 팀 훈련의 질을 높입니다.',
      '처음 만난 러너와 금방 친구가 됩니다. 훈련이 곧 소셜 이벤트.',
      '열정이 식으면 새로운 달리기 도전(야간런, 코스튬 마라톤)으로 재점화.',
    ],
    paceType:'fneg',
    race:[
      '<strong>강제 네거티브 스플릿</strong>이 필요합니다. 파티 분위기와 응원에 반응해 초반 오버페이스 위험 최고.',
      '0–5km: 응원, 분위기, 화려한 유니폼에 반응하지 말 것. GPS 알람 필수.',
      '⚠️ "이 정도는 괜찮겠지"라는 생각이 드는 순간이 바로 감속해야 할 신호.',
      '20–30km: 응원 구간에서 폭발적 에너지. 이 구간이 이 유형의 절정.',
      '완주 후 SNS 공유와 팀 파티가 에너지를 지속시키는 원동력. 레이스 중 폰은 금물.',
    ],
    nutri:[
      '달리기 후 맛있는 식사가 최고의 보상이자 동기.',
      '레이스 아침 식사를 잊어버릴 위험 1위 유형. 알람 2개 이상 설정.',
      '레이스 전날 팀 카보로딩 파티가 영양 전략의 일부이자 심리 준비.',
    ],
    rec:[
      '레이스 후 팀 회식·파티가 최고의 회복.',
      '혼자 쉬면 지루해서 오히려 회복이 안 됩니다. 가벼운 소셜 Easy 런으로 Active Recovery.',
      '재미없는 회복 루틴(폼롤러 30분 혼자)보다 파트너와 함께하면 실행률 상승.',
    ],
    trap:[
      '훈련보다 재미 우선 → 기초 체력 부족. 레이스에서 실력이 바닥을 드러냄.',
      '분위기에 따라 훈련량이 들쑥날쑥. 꾸준함이 가장 큰 과제.',
      '레이스 중 소셜 활동(대화, 셀카)으로 페이스를 잃는 반복 패턴.',
    ],
    best:['ISTJ','INTJ'],bestWhy:['규율이 에너지에 방향을 제공하는 완벽한 균형','전략이 파티 에너지를 기록으로 전환시키는 파트너'],
    care:['INTJ','INTP'],careWhy:['INTJ의 고독 중심·정밀 계획 훈련이 파티 에너지인 ESFP에게 숨막히게 느껴짐','INTP의 이론 중심·감정 표현 부족이 에너지와 감성이 넘치는 ESFP에게 거리감을 줌']},
};

type Screen = 'splash' | 'quiz' | 'result';

export default function App() {
  const [screen, setScreen] = useState<Screen>('splash');
  const [answers, setAnswers] = useState<(string|null)[]>(new Array(32).fill(null));
  const [curQ, setCurQ] = useState(0);
  const [myType, setMyType] = useState('');
  const [isAnim, setIsAnim] = useState(false);
  const [animClass, setAnimClass] = useState('');
  const [openSecs, setOpenSecs] = useState<number[]>([0]);
  const [toast, setToast] = useState('');
  const [toastOn, setToastOn] = useState(false);
  const [scLoading, setScLoading] = useState(false);
  const [typeResult, setTypeResult] = useState<any>(null);
  const [pcts, setPcts] = useState<any[]>([]);
  const captureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = document.createElement('style');
    el.textContent = CSS;
    document.head.appendChild(el);
    return () => { document.head.removeChild(el); };
  }, []);

  const showToast = useCallback((msg: string) => {
    setToast(msg); setToastOn(true);
    setTimeout(() => setToastOn(false), 2800);
  }, []);

  const computeType = (ans: (string|null)[]) => {
    const sc = [0,0,0,0];
    for (let d=0;d<4;d++) for (let i=0;i<8;i++) if (ans[d*8+i]==='A') sc[d]++;
    const type = [sc[0]>=4?'E':'I',sc[1]>=4?'S':'N',sc[2]>=4?'T':'F',sc[3]>=4?'J':'P'].join('');
    const p = sc.map((s,i)=>{
      const aL=['E','S','T','J'][i]; const bL=['I','N','F','P'][i];
      const ap=Math.round((s/8)*100);
      return{dom:ap>=50?aL:bL,pct:ap>=50?ap:100-ap};
    });
    return{type,pcts:p};
  };

  const selectAns = (ch: string) => {
    if (isAnim) return;
    const newAns = [...answers]; newAns[curQ]=ch; setAnswers(newAns);
    setIsAnim(true);
    setTimeout(()=>{
      if(curQ<31){
        setAnimClass('out');
        setTimeout(()=>{
          setCurQ(q=>q+1);
          setAnimClass('in');
          setTimeout(()=>{ setAnimClass(''); setIsAnim(false); },50);
        },200);
      } else {
        setIsAnim(false);
        const{type,pcts:p}=computeType(newAns);
        setMyType(type); setTypeResult(TD[type]); setPcts(p);
        setScreen('result'); window.scrollTo(0,0);
      }
    },280);
  };

  const retry = () => { setAnswers(new Array(32).fill(null)); setCurQ(0); setScreen('splash'); };
  const toggleSec = (idx: number) => {
    setOpenSecs(prev => prev.includes(idx) ? prev.filter(i=>i!==idx) : [...prev,idx]);
  };

  const shareKakao = () => {
    if(!myType){showToast('먼저 테스트를 완료해주세요!');return;}
    const d=typeResult;
    const text=`🏃 나의 러닝 MBTI는 ${myType}!\n${d.nm}\n"${d.tag}"\n\nMBTI RUNNING에서 나만의 러너 유형을 발견해보세요!`;
    const url=location.href;
    if(navigator.share){
      navigator.share({title:`러닝 MBTI — ${myType} ${d.nm}`,text,url})
        .then(()=>showToast('공유 완료!'))
        .catch(err=>{ if(err.name!=='AbortError'){ copyTextFallback(text+'\n'+url); }});
    } else { copyTextFallback(text+'\n'+url); showToast('📋 카카오톡에 붙여넣기 해주세요!');}
  };
  const copyLink = () => {
    const url=location.href;
    if(navigator.clipboard){ navigator.clipboard.writeText(url).then(()=>showToast('🔗 링크가 복사됐어요!')); }
    else { copyTextFallback(url); showToast('🔗 링크가 복사됐어요!'); }
  };
  const copyTextFallback = (text: string) => {
    const ta=document.createElement('textarea');
    ta.value=text;ta.style.position='fixed';ta.style.opacity='0';
    document.body.appendChild(ta);ta.select();
    try{document.execCommand('copy');}catch(e){}
    document.body.removeChild(ta);
  };
  const takeScreenshot = () => {
    if(!myType||!captureRef.current){showToast('먼저 테스트를 완료해주세요!');return;}
    setOpenSecs([0,1,2,3,4,5]); setScLoading(true);
    setTimeout(()=>{
      (window as any).html2canvas(captureRef.current,{scale:2,useCORS:true,allowTaint:true,backgroundColor:'#F2F4F6'}).then((canvas:HTMLCanvasElement)=>{
        setScLoading(false);
        const link=document.createElement('a');
        link.download=`MBTI_RUNNING_${myType}.png`;
        link.href=canvas.toDataURL('image/png'); link.click();
        showToast('📷 이미지가 저장됐어요!');
      }).catch(()=>{setScLoading(false);showToast('저장 실패. 직접 스크린샷을 사용해주세요.');});
    },400);
  };

  // ── SPLASH ──
  if(screen==='splash') return (
    <div className="screen on" id="splash" style={{background:'#fff'}}>
      <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'48px 24px'}}>
        <div className="splash-icon">🏃</div>
        <div className="splash-title">나는 어떤<br/><em>러너</em>인가?</div>
        <div className="splash-sub">러닝 MBTI 성향 테스트</div>
        <div className="splash-chips">
          <span className="chip">32문항</span><span className="chip">16가지 유형</span><span className="chip">약 3분</span>
        </div>
        <div style={{width:'100%',background:'var(--white)',borderRadius:'var(--r)',padding:'20px',marginBottom:'28px',boxShadow:'var(--shadow-sm)'}}>
          <div style={{fontSize:'13px',fontWeight:600,color:'var(--t1)',marginBottom:'10px'}}>이런 분께 추천해요</div>
          <div style={{display:'flex',flexDirection:'column',gap:'7px'}}>
            {['달리기를 시작했지만 훈련법이 막막한 분','내 성격과 맞는 대회 전략이 궁금한 분','MBTI를 좋아하는 러닝 입문자·마니아 모두'].map((t,i)=>(
              <div key={i} style={{fontSize:'13px',color:'var(--t2)',display:'flex',alignItems:'flex-start',gap:'8px'}}>
                <span style={{color:'var(--blue)',flexShrink:0}}>✓</span>{t}
              </div>
            ))}
          </div>
        </div>
        <button className="btn-main" onClick={()=>{setAnswers(new Array(32).fill(null));setCurQ(0);setScreen('quiz');}}>테스트 시작하기 →</button>
        <div className="splash-note">무료 · 로그인 불필요</div>
      </div>
      <div className={`toast${toastOn?' on':''}`}>{toast}</div>
    </div>
  );

  // ── QUIZ ──
  if(screen==='quiz') {
    const q=Qs[curQ];
    const dim=Math.floor(curQ/8);
    const sel=answers[curQ];
    return (
      <div className="screen on" id="quiz" style={{background:'var(--bg)'}}>
        <div className="quiz-top">
          <div className="quiz-meta">
            <span className="quiz-step">{curQ+1} / 32</span>
            <span className="quiz-dim">{DIMS[dim]}</span>
          </div>
          <div className="progress-outer">
            <div className="progress-inner" style={{width:`${(curQ/32)*100+3}%`}}/>
          </div>
        </div>
        <div className="quiz-body">
          <div className={`q-wrap${animClass?' '+animClass:''}`}>
            <div className="q-card">
              <div className="q-num">Q{curQ+1}</div>
              <div className="q-text">{q.q}</div>
            </div>
            <div className="opts">
              {(['A','B'] as const).map((ch,i)=>(
                <button key={ch} className={`opt${sel===ch?' correct':''}`} onClick={()=>selectAns(ch)}>
                  <div className="opt-badge">{ch}</div>
                  <div className="opt-text">{i===0?q.a:q.b}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className={`toast${toastOn?' on':''}`}>{toast}</div>
      </div>
    );
  }

  // ── RESULT ──
  if(screen==='result' && typeResult) {
    const d=typeResult;
    const pc=PACE_CLASS[d.paceType];
    const pl=PACE_LABELS[d.paceType];
    const pdesc=PACE_DESC[d.paceType];

    const sections = [
      {icon:'🏃',color:'blue',title:'훈련 전략',content:(
        <div>
          <div className="info-box blue">
            <div className="info-box-title blue">🏋️ 권장 훈련 시스템</div>
            <p className="blue" style={{fontWeight:700,fontSize:'14px',marginBottom:'4px'}}>{d.sys}</p>
            <p className="blue">{d.sysDetail}</p>
          </div>
          <div className="r-list">{d.train.map((t:string,i:number)=><div key={i} className="r-item" dangerouslySetInnerHTML={{__html:t}}/>)}</div>
          <div style={{marginTop:'14px',padding:'14px 16px',background:'var(--bg)',borderRadius:'12px'}}>
            <div style={{fontSize:'12px',fontWeight:600,color:'var(--t3)',marginBottom:'10px'}}>주간 훈련 예시 (마라톤 피크 기준)</div>
            <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
              {d.week.map((w:any,i:number)=>(
                <div key={i} style={{display:'flex',alignItems:'center',gap:'10px'}}>
                  <span style={{fontSize:'11px',fontWeight:700,color:'var(--blue)',minWidth:'22px'}}>{w.n}</span>
                  <span style={{fontSize:'13px',fontWeight:600,color:'var(--t1)',minWidth:'64px'}}>{w.t}</span>
                  <span style={{fontSize:'12px',color:'var(--t3)'}}>{w.d}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )},
      {icon:'🏁',color:'orange',title:'대회 페이스 전략',content:(
        <div style={{paddingTop:'14px'}}>
          <div className={`pace-badge ${pc}`}>{pl}</div>
          <div style={{fontSize:'12px',color:'var(--t2)',lineHeight:1.65,marginBottom:'12px',padding:'10px 14px',background:'var(--bg)',borderRadius:'10px'}}>{pdesc}</div>
          <div className="r-list">{d.race.map((r:string,i:number)=><div key={i} className="r-item" dangerouslySetInnerHTML={{__html:r}}/>)}</div>
        </div>
      )},
      {icon:'🥗',color:'green',title:'영양 전략',content:(
        <div>
          <div className="r-list">{d.nutri.map((n:string,i:number)=><div key={i} className="r-item" dangerouslySetInnerHTML={{__html:n}}/>)}</div>
          <div className="info-box green" style={{marginTop:'12px'}}>
            <div className="info-box-title green">⚠️ 레이스 당일 처음 시도 금지</div>
            <p className="green">모든 젤·드링크는 반드시 장거리 훈련 중 먼저 테스트. 위장 적응 없이 고용량 탄수화물을 갑자기 섭취하면 GI 트러블(복통·구역) 위험이 높아집니다.</p>
          </div>
        </div>
      )},
      {icon:'😴',color:'purple',title:'회복 전략',content:(
        <div>
          <div className="r-list">{d.rec.map((r:string,i:number)=><div key={i} className="r-item" dangerouslySetInnerHTML={{__html:r}}/>)}</div>
          <div className="info-box orange" style={{marginTop:'12px'}}>
            <div className="info-box-title orange">과훈련 조기 신호 (3개 이상이면 훈련량 40% 즉시 감소)</div>
            <p className="orange">안정 시 심박수 7회↑ · 평소 쉬운 페이스가 힘겨움 · 수면 후에도 피로 · 훈련 의욕 급락 · 기분 저하·짜증 · 잦은 감기</p>
          </div>
        </div>
      )},
      {icon:'🤝',color:'blue',title:'러닝 파트너 궁합',content:(
        <div style={{paddingTop:'10px'}}>
          <div style={{fontSize:'12px',fontWeight:700,color:'var(--green)',marginBottom:'6px'}}>최고의 파트너</div>
          {d.best.map((bt:string,i:number)=>(
            <div key={i} className="compat-row">
              <div className="compat-code">{bt}</div>
              <div className="compat-why"><strong style={{color:'var(--t1)'}}>{TD[bt]?.nm}</strong><br/>{d.bestWhy[i]}</div>
              <div className="compat-score high">최고</div>
            </div>
          ))}
          <div style={{fontSize:'12px',fontWeight:700,color:'var(--red)',marginTop:'14px',marginBottom:'6px'}}>주의가 필요한 유형</div>
          {d.care.map((ct:string,i:number)=>(
            <div key={i} className="compat-row">
              <div className="compat-code">{ct}</div>
              <div className="compat-why"><strong style={{color:'var(--t1)'}}>{TD[ct]?.nm}</strong><br/>{d.careWhy[i]}</div>
              <div className="compat-score low">주의</div>
            </div>
          ))}
          <div className="info-box" style={{background:'#F8F9FA',border:'1px solid var(--border)',marginTop:'12px'}}>
            <p style={{fontSize:'12px',color:'var(--t2)'}}>"주의 유형"은 나쁜 것이 아닙니다. 서로의 차이를 이해하고 의식적으로 조율하면 오히려 강한 시너지가 납니다.</p>
          </div>
        </div>
      )},
      {icon:'⚠️',color:'red',title:'이 유형의 함정',content:(
        <div className="r-list">{d.trap.map((t:string,i:number)=><div key={i} className="r-item" dangerouslySetInnerHTML={{__html:t}}/>)}</div>
      )},
    ];

    return (
      <div className="screen on" id="result" style={{background:'var(--bg)'}}>
        <div className="share-section" style={{position:'sticky',top:0,zIndex:10}}>
          <div className="share-title">결과 공유하기</div>
          <div className="share-row">
            <button className="share-btn" onClick={shareKakao}><div className="share-btn-icon" style={{background:'#FEE500'}}>💬</div><span className="share-btn-label">카카오톡</span></button>
            <button className="share-btn" onClick={copyLink}><div className="share-btn-icon" style={{background:'var(--blue-bg)'}}>🔗</div><span className="share-btn-label">링크 복사</span></button>
            <button className="share-btn" onClick={takeScreenshot}><div className="share-btn-icon" style={{background:'var(--green-bg)'}}>📷</div><span className="share-btn-label">스크린샷</span></button>
          </div>
        </div>

        <div ref={captureRef}>
          <div className="result-hero">
            <div className="result-label">나의 러닝 MBTI</div>
            <div className="result-code">{myType}</div>
            <div className="result-name">{d.nm}</div>
            <div className="result-tag">"{d.tag}"</div>
            <div className="result-dims">
              {pcts.map((p:any,i:number)=><div key={i} className="dim-pill">{p.dom} {p.pct}%</div>)}
            </div>
          </div>
          <div className="result-sections">
            {sections.map((s,idx)=>(
              <div key={idx} className={`r-sec${openSecs.includes(idx)?' open':''}`}>
                <div className="r-sec-hdr" onClick={()=>toggleSec(idx)}>
                  <div className="r-sec-hdr-left">
                    <div className={`r-sec-icon ${s.color}`}>{s.icon}</div>
                    <div className="r-sec-title">{s.title}</div>
                  </div>
                  <span className="r-sec-chevron">⌄</span>
                </div>
                <div className="r-sec-body">{s.content}</div>
              </div>
            ))}
          </div>
        </div>

        <button className="retry-btn" onClick={retry}>↺ 다시 테스트하기</button>
        <div className={`toast${toastOn?' on':''}`}>{toast}</div>
        {scLoading && (
          <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.6)',zIndex:8000,display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:'16px'}}>
            <div className="sc-spinner"/><div className="sc-text">이미지 저장 중...</div>
          </div>
        )}
      </div>
    );
  }
  return null;
}
