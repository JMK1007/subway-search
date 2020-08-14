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
        <span class="list__line" data-line_num="${data.line_num}">${data.line_num}</span>
        <span class="list__name" data-line_num="${data.line_num}"> ${data.station_nm}</span>
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

  // 같은 역 필터링, 라인 번호만 배열로 전달, 색 변경
  const inputSub = datas.filter((sub) => sub.station_nm === name);
  const lineNum = inputSub.map((sub) => sub.line_num);
  changeColor(lineNum[0]);

  input.value = '';
  input.focus();
}

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
  });
}

// main
loadData()
  .then((datas) => {
    displayDatas(datas);
    setEventListeners(datas);
  })
  .catch(console.log);
