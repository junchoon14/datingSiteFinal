(function () {
  // new variable
  const BASE_URL = 'https://lighthouse-user-api.herokuapp.com/'
  const INDEX_URL = BASE_URL + 'api/v1/users/'
  const heartImg = 'https://drive.google.com/uc?export=download&id=1B0aCopuqw6-zZXz0WkemAb9FjqVP5tuc'
  const data = JSON.parse(localStorage.getItem('favoriteMates')) || []
  const menu = document.getElementById('menu')
  const item = menu.children
  const searchBtn = document.getElementById('submit-search')
  const searchInput = document.getElementById('search')
  const dataPanel = document.getElementById('data-panel')
  const modalTitle = document.getElementById('show-mate-title')
  const modalImage = document.getElementById('show-mate-image')
  const modalDate = document.getElementById('show-mate-date')
  const modalGender = document.getElementById('show-mate-gender')
  const modalAge = document.getElementById('show-mate-age')
  const modalRegion = document.getElementById('show-mate-region')
  const modalBirthday = document.getElementById('show-mate-birthday')
  const modalEmail = document.getElementById('show-mate-email')

  displayDataList(data)

  // listen to navigation
  menu.addEventListener('click', (event) => {
    if (event.target.classList.contains('all')) {
      console.log('all')
      displaySelected(event, item, 4)
      displayDataList(data)
    } else if (event.target.classList.contains('male')) {
      console.log('1')
      displaySelected(event, item, 4)
      displayDataList(maleData)
      console.log(maleData)
    } else if (event.target.classList.contains('female')) {
      console.log('2')
      displaySelected(event, item, 4)
      displayDataList(femaleData)
      console.log(femaleData)
    }
  })

  // listen to search btn click event
  searchBtn.addEventListener('click', (event) => {
    let results = []
    event.preventDefault()
    const regex = new RegExp(searchInput.nodeValue, 'i')
    results = data.filter(person => person.name.match(regex))
    console.log(results)
    displayDataList(results)
  })

  // listen to card image to get mate information
  dataPanel.addEventListener('click', (event) => {
    if (event.target.matches('.card-img')) {
      console.log(event.target.dataset.id)
      showMateInfo(event.target.dataset.id)
    } else if (event.target.matches('.heart-img')) {

      //listen to heart mark
      if (!event.target.classList.contains('favorMate')) {
        event.target.classList.add('favorMate')
        addFavoriteItem(event.target.dataset.id)
        console.log(event.target.dataset.id)
      } else if (event.target.classList.contains('favorMate')) {
        event.target.classList.remove('favorMate')
        removeFavoriteItem(event.target.dataset.id)
        console.log(event.target.dataset.id)
      }
      console.log(event.target.classList)
      console.log('click')
    }
  })

  /////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////// Functions /////////////////////////////////

  // add mate to favorite list
  function addFavoriteItem(id) {
    const list = JSON.parse(localStorage.getItem('favoriteMates')) || []
    const mate = data.find(person => person.id === Number(id))
    list.push(mate)
    localStorage.setItem('favoriteMates', JSON.stringify(list))
    alert(`Added ${mate.name} to your favorite list!`)
  }

  // removie mate and update localStorage
  function removeFavoriteItem(id) {
    const list = JSON.parse(localStorage.getItem('favoriteMates')) || []
    const mate = list.find(person => person.id === Number(id))
    // find mate by id
    const index = list.findIndex(item => item.id === Number(id))
    if (index === -1) return
    list.splice(index, 1)
    localStorage.setItem('favoriteMates', JSON.stringify(list))
    alert(`${mate.name} is already removed from your favorite list.`)
    displayDataList(list)
  }

  // give gender a different color
  function pickGender(data) {
    maleData = []
    femaleData = []
    for (let people of data) {
      if (people['gender'] === 'male') {
        maleData.push(people)
      } else if (people['gender'] === 'female') {
        femaleData.push(people)
      } else {
        console.log('Error!')
      }
    }
  }

  // list people cards
  function displayDataList(data) {
    let display = localStorage.getItem('display') || 'card'
    const list = JSON.parse(localStorage.getItem('favoriteMates')) || []
    let htmlContent = ''
    if (display === 'card') {
      data.forEach(function (item, index) {
        htmlContent += `
        <div class="col-6 col-sm-5 col-md-4 col-lg-3">
          <div class="card mb-3">
            <img class="card-img pointer" src="${item.avatar}" alt="Card image cap" data-toggle="modal" data-target="#show-mate-modal" data-id="${item.id}">
            `
        // get favor data to marked heart
        if (list.some(person => person.id === Number(item.id))) {
          htmlContent += `
        <img class="card-mark heart-img favorMate" src="${heartImg}" alt="heart-image" data-id="${item.id}">
          `
        } else {
          htmlContent += `
        <img class="card-mark heart-img" src="${heartImg}" alt="heart-image" data-id="${item.id}">
          `
        }
        // gender classified
        if (item.gender === 'male') {
          htmlContent += `
            <div class="gender bg-male">
            </div>
          `
        } else if (item.gender === 'female') {
          htmlContent += `
            <div class="gender bg-female">
            </div>
          `
        }

        htmlContent += `
            <div class="card-body">
            <div class="info">
              <h6 class="card-name mt-1">${item.name} ${item.surname}</h6>
              <p class="age-region mt-1">${item.age} - ${item.region}</p>
            </div>
          </div>
          </div>
        </div >
          `
      })
    } else if (display === 'list') {
      htmlContent += `<ul class="list list-group">`
      data.forEach(function (item, index) {
        let date = new Date(item.updated_at).toLocaleString()
        htmlContent += `
          <li class="list-group-item rounded-0 border-right-0 border-left-0 clearfix">
            <div class="item-body mate-item-body float-left">
              <img class="item-img" src="${item.avatar}" alt="List image cap">
            </div>

            <div class="list-content float-left ml-2">
             <div class="list-title">
              <h6 class="item-title mt-1">${item.name} ${item.surname}</h6>
             </div>

             <div class="list-content-1 float-left">
              <p><a>Gender : </a><a>${item.gender}</a></p>
              <p><a>Age : </a><a>${item.age}</a></p>
              <p><a>Region : </a><a>${item.region}</a></p>
             </div>

             <div class="list-content-2 float-left ml-5">
              <p><a>Birthday : </a><a>${item.birthday}</a></p>
              <p><a>Email : </a><a>${item.email}</a></p>
              <p><small><em id="show-mate-date" class="text-muted">${date}</em></small></p>
             </div>
            </div>

            <div class="list-footer mr-5 mt-4 float-right">
            `
        // get favor data to marked heart
        if (list.some(person => person.id === Number(item.id))) {
          htmlContent += `
            <img class="list-mark heart-img favorMate" src="${heartImg}" alt="heart-image" data-id="${item.id}">
        `
        } else {
          htmlContent += `
            <img class="list-mark heart-img" src="${heartImg}" alt="heart-image" data-id="${item.id}">
        `
        }
        htmlContent += `
          </div >
        </li >
        `
      })
      htmlContent += `
        </ul >
          `
    }
    dataPanel.innerHTML = htmlContent
  }

  // show detail information in modal
  function showMate(id) {
    // set request url
    const url = INDEX_URL + id
    console.log(url)

    // send request to show api
    axios.get(url).then(response => {
      const data = response.data
      let date = new Date(data.updated_at).toLocaleString()
      console.log(response.data)
      console.log(data)

      // insert data into modal ui
      modalTitle.textContent = data.name + " " + data.surname
      modalImage.innerHTML = `<img src="${data.avatar}" class="img-fluid user-img" alt="Responsive image">`
      modalDate.textContent = `Release at : ${date}`
      modalGender.textContent = `${data.gender}`
      modalAge.textContent = `${data.age}`
      modalRegion.textContent = `${data.region}`
      modalBirthday.textContent = `${data.birthday}`
      modalEmail.textContent = `${data.email}`
    })
  }

  // get total pages
  function getTotalPages(data) {
    let totalPages = Math.ceil(data.length / ITEM_PER_PAGE) || 1
    let pageItemContent = ''
    for (let i = 0; i < totalPages; i++) {
      pageItemContent += `
        <li class="page-item">
          <a class="page-link" href="javascript:;" data-page="${i + 1}">${i + 1}</a>
        </li>
      `
    }
    pagination.innerHTML = pageItemContent
  }

  // get page data
  function getPageData(pageNum, data) {
    paginationData = data || paginationData
    let offset = (pageNum - 1) * ITEM_PER_PAGE
    let pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE)
    displayDataList(pageData)
  }

})()