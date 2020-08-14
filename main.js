const line = {
  '01호선': '#0d347f',
  '02호선': '#3b9f37',
  '03호선': '#f28900',
  '04호선': '#00ace6',
  '05호선': '#ae00ff',
  '06호선': '#a67400',
  '07호선': '#2f4420',
  '08호선': '#d40074',
  '09호선': '#9c8c00',
  인천선: '#7bb0d4',
  인천2호선: '#fcc74c',
  분당선: '#ffd000',
  신분당선: '#9e003a',
  경의선: '#94d4c1',
  경춘선: '#08cfa7',
  공항철도: '#8bd2e8',
  의정부경전철: '#ffc342',
  수인선: '#fada07',
  용인경전철: '#8fdb90',
  경강선: '#2d88f7',
  우이신설경전철: '#ceed91',
  서해선: '#7ebd04',
};

const input = document.querySelector('.search__input');
const searchBtn = document.querySelector('.search__button');
const subway = document.querySelector('.subway');
const before = document.querySelector('.subway__before');
const current = document.querySelector('.subway__current');
const after = document.querySelector('.subway__after');
const lists = document.querySelector('.subway__lists');
const alert = document.querySelector('.subway__alert');
const logo = document.querySelector('.search__logo');

// 데이터 가져오기
function loadData() {
  return fetch('subway_data.json')
    .then((response) => response.json())
    .then((json) => json.DATA);
}

// 전체 역 데이터 업데이트
function displayDatas(datas) {
  lists.innerHTML = datas.map((data) => createHTMLString(data)).join('');
}

// 가져온 데이터로 HTML 리스트 아이템 생성
function createHTMLString(data) {
  return `
  <li class="subway__list invisible" data-line_num="${data.line_num}" data-station_cd="${data.station_cd}"
  data-station_nm="${data.station_nm}" data-fr_code="${data.fr_code}">
        <span class="list__line" data-line_num="${data.line_num}" data-station_cd="${data.station_cd}">${data.line_num}</span>
        <span class="list__name" data-line_num="${data.line_num}" data-station_cd="${data.station_cd}"> ${data.station_nm}</span>
      </li>
  `;
}

// 검색된 역만 출력
function displaySub(name, allList) {
  allList.forEach((list) => {
    if (list.dataset.station_nm === name) {
      console.log(list);
      list.classList.remove('invisible');
    } else {
      list.classList.add('invisible');
    }
  });
}

function isRight(arrayAllList) {
  if (arrayAllList.every((list) => list.classList.contains('invisible'))) {
    current.innerHTML = `
  <span class="current__name">다시 입력해주세요</span>
`;
    return;
  }
}

// 역 검색
function searchSub(datas) {
  // 검색 시 경고문고 삭제
  alert.classList.add('invisible');

  // input에 적힌 역이름 출력
  const name = input.value;
  if (name === '') {
    input.focus();
    return;
  }
  current.innerHTML = `
  <span class="current__name">${name}</span>
`;

  // 리스트에서 같은 역들만 출력
  const allList = document.querySelectorAll('.subway__list');
  displaySub(name, allList);

  // 잘못된 역 입력 시
  const arrayAllList = Array.from(allList);
  isRight(arrayAllList);

  // 같은 역 필터링, 라인 번호만 배열로 전달, 색 변경
  const inputSub = datas.filter((sub) => sub.station_nm === name);
  const lineNum = inputSub.map((sub) => sub.line_num);
  const stationCd = inputSub[0].station_cd;

  changeColor(lineNum[0]);
  beforeAfter(stationCd, allList);
  input.value = '';
  input.focus();
}

// 앞, 뒤 역 출력
function beforeAfter(stationCd, allList) {
  const cdParse = parseInt(stationCd);
  const beforeNum = cdParse < 1000 ? `0${cdParse - 1}` : `${cdParse - 1}`;
  const afterNum = cdParse < 1000 ? `0${cdParse + 1}` : `${cdParse + 1}`;
  const ba = Array.from(allList);
  const result = ba.filter(
    (list) =>
      list.dataset.station_cd === beforeNum ||
      list.dataset.station_cd === afterNum
  );
  if (result.length === 2) {
    before.innerHTML = `
    <span class="before__name">${result[0].dataset.station_nm}</span>
  `;
    after.innerHTML = `
    <span class="after__name">${result[1].dataset.station_nm}</span>
  `;
  } else {
    before.innerHTML = `
    <span class="before__name">${result[0].dataset.station_nm}</span>
  `;
    after.innerHTML = `
    <span class="after__name"></span>
  `;
  }
}

function beforeAfter(stationCd) {
  const allList = document.querySelectorAll('.subway__list');
  const cdParse = parseInt(stationCd);
  const beforeNum = cdParse < 1000 ? `0${cdParse - 1}` : `${cdParse - 1}`;
  const afterNum = cdParse < 1000 ? `0${cdParse + 1}` : `${cdParse + 1}`;

  console.log(stationCd);
  console.log(beforeNum);
  console.log(afterNum);
  const ba = Array.from(allList);
  const result = ba.filter(
    (list) =>
      list.dataset.station_cd === beforeNum ||
      list.dataset.station_cd === afterNum
  );

  if (result.length === 2) {
    before.innerHTML = `
    <span class="before__name">${result[0].dataset.station_nm}</span>
  `;
    after.innerHTML = `
    <span class="after__name">${result[1].dataset.station_nm}</span>
  `;
  } else {
    before.innerHTML = `
    <span class="before__name">${result[0].dataset.station_nm}</span>
  `;
    after.innerHTML = `
    <span class="after__name"></span>
  `;
  }
}

// 리스트 선택 표시
function selectList(target) {
  const allList = document.querySelectorAll('.subway__list');
  allList.forEach((list) => {
    if (target === list || target.parentNode === list) {
      list.classList.add('selected');
    } else {
      list.classList.remove('selected');
    }
  });
}

// 로고 누르면 리스트 리셋
function resetList() {
  const allList = document.querySelectorAll('.subway__list');
  allList.forEach((list) => {
    list.classList.add('invisible');
  });
  alert.classList.remove('invisible');
  current.innerHTML = `
  <span class="current__name">역을 검색해주세요</span>
`;
}

// 라인 번호 받아서 색 변경
function changeColor(lineNum) {
  before.style.backgroundColor = line[lineNum];
  current.style.backgroundColor = line[lineNum];
  after.style.backgroundColor = line[lineNum];
}

function setEventListeners(datas) {
  searchBtn.addEventListener('click', () => {
    searchSub(datas);
  });
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      searchSub(datas);
    }
  });
  lists.addEventListener('click', (e) => {
    const target = e.target;
    changeColor(target.dataset.line_num);
    selectList(target);
    beforeAfter(target.dataset.station_cd);
  });
  logo.addEventListener('click', () => {
    resetList();
  });
}

// main
loadData()
  .then((datas) => {
    displayDatas(datas);
    setEventListeners(datas);
  })
  .catch(console.log);
