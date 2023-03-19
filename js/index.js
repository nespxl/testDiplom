document.addEventListener('DOMContentLoaded', () => {
    const main = document.getElementById('main')

    // Создание формы
    const form = document.createElement('form')
    const labelSurname = document.createElement('label')
    const labelName = document.createElement('label')
    const inputSurname = document.createElement('input')
    const inputName = document.createElement('input')
    const submit = document.createElement('input')
    const typeJson = document.createElement('input')
    const buttonView = document.createElement('button')
    
    inputSurname.innerHTML = 'Фамилия'
    inputName.innerHTML = 'Имя'
    submit.type = 'submit'
    typeJson.type = 'file'
    inputSurname.placeholder = 'Введите фамилию'
    inputName.placeholder = 'Введите имя'
    
    form.classList.add('form')
    labelSurname.classList.add('label')
    labelName.classList.add('label')
    inputName.classList.add('inputName')
    inputSurname.classList.add('inputSurname')
    
    inputName.name = 'name'
    inputSurname.name = 'surname'
    typeJson.name = 'file'
    typeJson.onchange = `download(typeJson)`
    typeJson.accept = 'application/json'

    function readFile(input) {
        let file = input.files[0];
      
        let reader = new FileReader();
      
        reader.readAsText(file);
      
        reader.onload = function() {
            const result = reader.result

            String.prototype.replaceAll = function(search, replacement) {
                var target = this;
                return target.replace(new RegExp(search, 'g'), replacement);
            };
            
            let str = result;
            str = str.replaceAll('lat', '"lat"');
            str = str.replaceAll('lng', '"lng"');
            const a = JSON.parse('{"obj":[' + str + ']}');
            console.log(a.obj[0].name);
            inputName.value = a.obj[0].name
            inputSurname.value = a.obj[0].surname
        };
      
        reader.onerror = function() {
          console.log(reader.error);
        };
    }

    // Создвем объект для пуша полей, впоследствии отправим на сервак
    const data = {}

    submit.addEventListener('click', (e) => {
        e.preventDefault()

        // Записываем нужные поля в твоем случае вроде там пароль и логин
        data.name = inputName.value
        data.surname = inputSurname.value

        // Отправляем объект методом POST на сервер по адресу: http://localhost:3000/db
        const sendData = async () => {
            const response = await fetch('http://localhost:3000/db', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json' // жесткий миме тип
                },
                body: JSON.stringify(data)
            })
            const dataBase = await response.json()
        }
    
        sendData()    

    })

    buttonView.innerHTML = 'Кнопка'

    buttonView.addEventListener('click', (e) => {
        e.preventDefault()
        console.log(typeJson)
        readFile(typeJson)
    })

    typeJson.addEventListener('onchange', () => {
        console.log('typeJson')
    })

    labelSurname.append(inputSurname, inputName)
    form.append(labelSurname, labelName, submit, typeJson, buttonView)
    main.append(form)
})
