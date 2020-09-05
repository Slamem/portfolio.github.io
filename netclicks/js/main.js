const IMG_URL = "https://image.tmdb.org/t/p/w185_and_h278_bestv2";

const leftMenu = document.querySelector('.left-menu'),
      dropdown = document.querySelectorAll('.dropdown'),
      hamburger = document.querySelector('.hamburger'),
      tvShowsList = document.querySelector('.tv-shows__list'),
      modal = document.querySelector('.modal'),
      tvShows = document.querySelector('.tv-shows'),
      tvCardImg = document.querySelector('.tv-card__img'),
      modalTitle = document.querySelector('.modal__title'),
      genresList = document.querySelector('.genres-list'),
      rating = document.querySelector('.rating'),
      description = document.querySelector('.description'),      
      modalLink = document.querySelector('.modal__link'),
      searchForm = document.querySelector('.search__form',),
      searchFormInput = document.querySelector('.search__form-input'),
      preloader = document.querySelector('.preloader'),
      tvShowsHead = document.querySelector('.tv-shows__head'),
      pagination = document.querySelector('.pagination'),
      trailer = document.getElementById('trailer'),
      headTrailer = document.getElementById('headTrailer');

const loading = document.createElement('div');
      loading.className = 'loading';

const DBrequest = class {
    constructor() {
        this.SERVER = 'https://api.themoviedb.org/3';
        this.API_KEY = '7e09558c65e8df7d683d1a11407ec773';
    }

    getData = async(url) => {
        const res = await fetch(url);
        if (res.ok) {
            return res.json();
        } else {
            throw new Error(`Не удалось получить данные по адресу ${url}`);
        };
    };
    getTestData = () => {this.getData('test.json');};
    getTesCard = () => {this.getData('card.json');};
    getSearchResult = query => {
        this.temp = `${this.SERVER}/search/tv?api_key=${this.API_KEY}&language=ru-RU&query=${query}`;
        return this.getData(this.temp)};
    getNextPage = page => this.getData(this.temp + '&page=' +page);
    getTvShow = id => this.getData(`${this.SERVER}/tv/${id}?api_key=${this.API_KEY}&language=ru-RU`);
    getTopRated = () => this.getData(`${this.SERVER}/tv/top_rated?api_key=${this.API_KEY}&language=ru-RU`);
    getTvToday = () => this.getData(`${this.SERVER}/tv/airing_today?api_key=${this.API_KEY}&language=ru-RU`);
    getPopular = () => this.getData(`${this.SERVER}/tv/popular?api_key=${this.API_KEY}&language=ru-RU`);
    getWeek = () => this.getData(`${this.SERVER}/tv/on_the_air?api_key=${this.API_KEY}&language=ru-RU`);
    getTrailer = id => this.getData(`${this.SERVER}/tv/${id}/videos?api_key=${this.API_KEY}&language=ru-RU`);
};

const dbService = new DBrequest();
    

    dbService.getTvToday().then((response) => renderCard(response));
    loading.remove;

const renderCard = (response, target) => {
    tvShowsList.textContent = '';

    if (!response.total_results) {
        loading.remove();
        tvShowsHead.textContent = "К сожалению по вашему запросу нечиго не найдено..."
        tvShowsHead.style.color = 'red';
        pagination.textContent = '';
        return;
    }
    tvShowsHead.textContent = target ? target.textContent : "Результат поиска:"
    tvShowsHead.style.color = 'green';

    response.results.forEach(item => {
        const {id,
               backdrop_path: backdrop, 
               name: title, 
               poster_path: poster,
               vote_average: vote
        } = item; 

        const posterIMG = poster ? IMG_URL + poster: 'img/no-poster.jpg';
        const backdropIMG = ((posterIMG == 'img/no-poster.jpg') ? '' : IMG_URL + backdrop) &&
                            (backdrop ? IMG_URL + backdrop : posterIMG);
        const voteElem = vote  ? `<span class="tv-card__vote">${vote}</span>` : '';

        const card = document.createElement('li');
        card.className = 'tv-shows__item';
        card.innerHTML = `
            <a href="#" id="${id}" class="tv-card">
                ${voteElem}
                <img class="tv-card__img"
                    src="${posterIMG}"
                    data-backdrop="${backdropIMG}"
                    alt="${title}">
                <h4 class="tv-card__head">${title}</h4>
            </a>`;

        loading.remove();
        tvShowsList.append(card);
    });
    pagination.textContent = '';

    if (!target && response.total_pages > 1) {
        for (let i = 1; i <= response.total_pages; i++)  {
            pagination.innerHTML += `<li><a href="#" class="pages">${i}</li>`
        };
    }  
};

searchForm.addEventListener('submit', e => {
    e.preventDefault();
    const value = searchFormInput.value.trim();
    if (value) {
        tvShows.append(loading);
        dbService.getSearchResult(value).then(renderCard);
    };
    searchFormInput.value = '';
});

hamburger.addEventListener('click', () => {
    leftMenu.classList.toggle('openMenu');
    hamburger.classList.toggle('open');
});

document.addEventListener('click', e => {
    if (!e.target.closest('.left-menu')) {
        leftMenu.classList.remove('openMenu');
        hamburger.classList.remove('open');
        closeDropdown();
    };
});

leftMenu.addEventListener('click', e => {
    e.preventDefault();
    const target = e.target;
    const dropdown = target.closest('.dropdown');
    if (dropdown) {
        dropdown.classList.toggle('active');
        leftMenu.classList.add('openMenu');
        hamburger.classList.add('open');
    };
    if (target.closest('#top-rated')) {
        tvShows.append(loading);
        dbService.getTopRated().then((response) => renderCard(response, target));
    }
    if (target.closest('#popular')) {
        tvShows.append(loading);
        dbService.getPopular().then((response) => renderCard(response, target));
    };
    if (target.closest('#week')) {
        tvShows.append(loading);
        dbService.getWeek().then((response) => renderCard(response, target));
    };
    if (target.closest('#today')) {
        tvShows.append(loading);
        dbService.getTvToday().then((response) => renderCard(response, target));
    };
    if (target.closest('#search')) {
        tvShowsHead.textContent = '';
        searchFormInput.value = '';
        searchFormInput.focus();
    }
});

const closeDropdown = () => {
    dropdown.forEach(item => {
        item.classList.remove('active');
    });
};

const changeImg = e => {
    const target = e.target;
    const card = target.closest('.tv-shows__item');
    if (card) {
        const img = card.querySelector('.tv-card__img');
        const changeImg = img.dataset.backdrop;
        if (changeImg) {
            img.dataset.backdrop = img.src;
            img.src = changeImg;
        };
    };
};

tvShowsList.addEventListener('mouseover', changeImg);
tvShowsList.addEventListener('mouseout', changeImg);
pagination.addEventListener('click', e => {
    e.preventDefault();
    const target = e.target;
    if (target.classList.contains('pages')) {
        tvShows.append(loading)
        dbService.getNextPage(target.textContent).then(renderCard);
    }
    document.documentElement.scrollTop = 0;
})

tvShowsList.addEventListener('click', e => {
    const target = e.target; 
    const card = target.closest('.tv-card');
    if (card) {
        preloader.style.display = 'block';
        dbService.getTvShow(card.id) 
            .then(data => {
                tvCardImg.src = data.poster_path ? IMG_URL + data.poster_path : 'img/no-poster.jpg';
                modalTitle.textContent = data.name;
                genresList.textContent = '';
                for (const item of data.genres) {
                    genresList.innerHTML += `<li>${item.name}</li>`
                };
                rating.textContent = data.vote_average;
                description.textContent = data.overview;
                modalLink.href = data.homepage;
                return data.id;
            })
            .then(dbService.getTrailer)
            .then(data => {
                headTrailer.classList.add = 'hide';
                headTrailer.textContent = '';
                trailer.textContent = '';
                if (data.results.length !== 0) {
                    headTrailer.style.remove = 'hide';
                    headTrailer.textContent = 'Трейлер';
                    data.results.forEach(item => {
                        const trailerItem = document.createElement('li');
    
                        trailerItem.innerHTML = `
                            <h4>${item.name}</h4>
                            <iframe 
                                width="400"
                                height="300"
                                src="https://www.youtube.com/embed/${item.key}"
                                frameborder="0"
                                allowfullscreen>
                            </iframe> 
                        `;
    
                        trailer.append(trailerItem);
                    })
                }
            })
            .then(() => {
                document.body.style.overflow = 'hidden';
                modal.classList.remove('hide')
            })
            .finally(() => {
                preloader.style.display = 'none';
            })
    };
}); 

modal.addEventListener('click', e => {
    const target = e.target;
    if (target.closest('.cross') || target.classList.contains('modal')) {
        document.body.style.overflow = '';
        modal.classList.add('hide');
    } 
});


