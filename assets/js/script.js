
    const   url         = 'https://fakerapi.it/api/v1/custom?title=text&image=image&short_description=text&published_at=date_time&last_news=boolean&_quantity=100';
    var     info        = {};  /// this is the response body from api
    var     allNews     = [];  /// containt the all news 
    var     lastNews    = [];  /// containt the last news 
    var     filterNews  = [];  /// contains the news filtered
    var     toShow      = [];  /// contains the news filtered by pagination to display in the table
    /// vars for pagination
    var     currentPag  = 1;   /// default page selected in the table
    var     perPage     = 8;   /// is the amount of news that will be displayed in the table
    var     pagesQua    = 0;

    /// Get api data
    function getData(url, callback) {
        fetch(url)
            .then(response => response.json())
                .then(result => callback(result));
    }
    getData(url, (data) => setData(data))
    
    /// save received data from api and set on table
    async function setData(data){
        info        =  data.data; 
        allNews     =  info; 
        filterNews  =  info; 
        lastNews    =  info.filter((e) => e.last_news == true);
        /// Activate essential functions
        await   FilterList(); // active filter
                createLastNews();
                pagination();
                othersPages();
                listeners();
                createTableRow(); /// create the first table content
    }       

    function createLastNews(){
        const newsGrid     =   document.getElementById('news');
        
        for(var i = 0; i <= 3; i++){
            let newTr = document.createElement("div");
            newTr.classList.add('card');
            newTr.innerHTML =  `
                <div class="card-header" style=" background-image: url('${lastNews[i].image}')"></div>
                <div class="card-body">
                    <h4>${lastNews[i].title.substring(0, 15)}</h4>
                    <p>${lastNews[i].short_description.substring(0, 70)}</p>
                </div>
            `;
            newsGrid.appendChild(newTr);
        }
    }

    async function FilterList(){
        var array       = Array.prototype;
        var inputs      = document.getElementsByClassName('ed-filter');
        function onInputEvent(e){
            var news    = allNews; /// [Array] to filter 
            var input   = e.target; /// get input 
            var value   = input.value;  /// get input value for filter
            var result  = news.filter((e) =>  e.title.toLowerCase().includes(value) || e.short_description.toLowerCase().includes(value) || e.published_at.date.includes(value));
            filterNews  = result; /// [result] of filter 
            currentPag  = 1;
            pagination();
            createTableRow();
            othersPages();
        }
        array.forEach.call(inputs, function(input){input.oninput = onInputEvent;});
    }   

    function createTableRow(){
        const table     =   document.getElementById('tableEd');
        table.innerHTML =   '';
        /// For each value in filter data we created a new tr in table 
        toShow.forEach(todo => {
            let newTr = document.createElement("tr");
            for(var i = 0; i <= 2; i++){
                let groupTd = document.createElement("td");
                switch (i) {
                    case 0  :   groupTd.innerText = todo.title.substring(0, 20);               break;
                    case 1  :   groupTd.innerText = todo.short_description.substring(0, 60);   break;
                    default :   groupTd.innerText = todo.published_at.date.slice(0,10).replace(/-/g,'/');;   break;
                }
                newTr.appendChild(groupTd);
            }
            table.appendChild(newTr);
        });
    }

    
    function pagination(){
        pagesQua            =   Math.ceil(filterNews.length / perPage);
        let end             =   currentPag * perPage
        let start           =   end - perPage;
        toShow              =   filterNews.slice(start, end);
    }


    function listeners(){

        const prevButton    = document.getElementById('bnt_prev');
        const nextButton    = document.getElementById('bnt_next');
        const prevbtn       = document.getElementById('page_prev');
        const nextbtn       = document.getElementById('page_next');

        prevButton.addEventListener('click', prevPage);
        nextButton.addEventListener('click', nextPage); 
        prevbtn.addEventListener('click', prevNumber);
        nextbtn.addEventListener('click', nextNumber); 

        function prevPage(){
            if(currentPag  > 1 && currentPag <= pagesQua){
                currentPag = currentPag - 1
                pagination()
                createTableRow();
                othersPages();
            }
        }
        function nextPage(){
            if(currentPag  < pagesQua ){
                currentPag = currentPag + 1;
                pagination();
                createTableRow();
                othersPages();
            }
        }
        function prevNumber(){
            if(currentPag  > 1){
                currentPag = currentPag - 1;
                othersPages();
                pagination(); 
                createTableRow();};   
        }
        function nextNumber(){
            if(currentPag  < pagesQua){
                currentPag = currentPag + 1;
                othersPages();
                pagination();
                createTableRow();
            };
        }
    }
    
    
    function othersPages(){
        if(currentPag  > 1){
            document.getElementById('page_prev').innerHTML = currentPag - 1;
        }else{
            document.getElementById('page_prev').innerHTML = '';
        }

        document.getElementById('page').innerHTML = currentPag;

        if(currentPag  < pagesQua){
            document.getElementById('page_next').innerHTML = currentPag + 1;
        }else{
            document.getElementById('page_next').innerHTML = '';
        }
    }