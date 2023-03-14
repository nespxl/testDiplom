document.addEventListener('DOMContentLoaded', () => {
    const main = document.getElementById('main')

    // Создание формы
    const form = document.createElement('form')
    const labelSurname = document.createElement('label')
    const labelName = document.createElement('label')
    const inputSurname = document.createElement('input')
    const inputName = document.createElement('input')
    const submit = document.createElement('input')
    
    inputSurname.innerHTML = 'Фамилия'
    inputName.innerHTML = 'Имя'
    submit.type = 'submit'
    inputSurname.placeholder = 'Введите фамилию'
    inputName.placeholder = 'Введите имя'
    
    form.classList.add('form')
    labelSurname.classList.add('label')
    labelName.classList.add('label')
    inputName.classList.add('inputName')
    inputSurname.classList.add('inputSurname')
    
    inputName.name = 'name'
    inputSurname.name = 'surname'

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

    labelSurname.append(inputSurname, inputName)
    form.append(labelSurname, labelName, submit)
    main.append(form)
})
