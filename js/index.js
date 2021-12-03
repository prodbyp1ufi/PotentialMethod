function generateTable(){
    var mainDiv = document.getElementsByClassName('enter-data')
    var newDiv = document.createElement('div')
    newDiv.className = 'table'
    var tableTitle = document.createTextNode('Транспортная таблица')
    newDiv.appendChild(tableTitle)
    var row = document.getElementById('row')
    var col = document.getElementById('col')
    if(row.value === '' || col.value === ''){
        console.log('Столбец или строка пустная')
        console.error('value is empty')
        return false
        
    }
    row.disabled = true
    col.disabled = true
    row = row.value
    col = col.value
    for (let i = 0; i < row; i++) {
        var newRow = document.createElement('div')
        newRow.className = 'row'
        for (let j = 0; j < col; j++) {
            var newCol = document.createElement('input')
            newCol.className = 'col'
            newCol.type = 'number'
            newCol.min = '0'
            newCol.value = '0'
            newRow.appendChild(newCol)
        }
        newDiv.appendChild(newRow)
    }
    
    var matrixATitle = document.createTextNode('Поставщики')
    newDiv.appendChild(matrixATitle)
    var matrixADiv = document.createElement('div')
    matrixADiv.className = 'matrix-a'
    var newRow = document.createElement('div')
    newRow.className = 'row'
    for (let i = 0; i < row; i++) {
        var newCol = document.createElement('input')
        newCol.className = 'col'
        newCol.type = 'number'
        newCol.min = '0'
        newCol.value = '0'
        newRow.appendChild(newCol)
    }
    matrixADiv.appendChild(newRow)
    newDiv.appendChild(matrixADiv)

    var matrixBTitle = document.createTextNode('Потребители')
    newDiv.appendChild(matrixBTitle)
    var matrixBDiv = document.createElement('div')
    matrixBDiv.className = 'matrix-b'
    var newRow = document.createElement('div')
    newRow.className = 'row'
    for (let i = 0; i < col; i++) {
        var newCol = document.createElement('input')
        newCol.className = 'col'
        newCol.type = 'number'
        newCol.min = '0'
        newCol.value = '0'
        newRow.appendChild(newCol)
    }
    matrixBDiv.appendChild(newRow)
    newDiv.appendChild(matrixBDiv)

    var delayDiv = document.createElement('div')
    delayDiv.className = '.delay-button-line'
    for (let i = 0; i < 2; i++) {
        var button = document.createElement('input')
        button.type = 'button'
        if(i === 0){
            button.value = 'Очистить'
            button.onclick = () => {
                var cells = document.getElementsByClassName('col')
                for (let i = 0; i < cells.length; i++) {
                    cells[i].value = '0'
                }
            }
        }
        else{
            button.value = 'Рассчитать'
            button.onclick = ()=>{
                var matrix = []
                var table = document.getElementsByClassName('table')
                table = table[0]
                var row = document.getElementById('row')
                var col = document.getElementById('col')
                row = row.value
                col = col.value
                for (let i = 0; i < row; i++) {
                    var rows = table.children[i]
                    matrix.push([])
                    for (let j = 0; j < col; j++) {
                        matrix[i].push(parseInt(rows.children[j].value))
                    }
                    
                }
                var matrixA = []
                var matrixADiv = document.getElementsByClassName('matrix-a')
                matrixADiv = matrixADiv[0].children[0]
                for (let i = 0; i < matrixADiv.children.length; i++) {
                    matrixA.push(parseInt(matrixADiv.children[i].value))
                    
                }
                var matrixB = []
                var matrixBDiv = document.getElementsByClassName('matrix-b')
                matrixBDiv = matrixBDiv[0].children[0]
                for (let i = 0; i < matrixBDiv.children.length; i++) {
                    matrixB.push(parseInt(matrixBDiv.children[i].value))
                }
                res = StartMehthod(matrix,matrixA,matrixB,0)
                var mainDiv = document.getElementsByClassName('enter-data')
                var p = document.createElement('p')
                p.innerText = res
                mainDiv[0].appendChild(p)
                let saveLink = document.createElement('a')
                saveLink.innerText = 'Сохранить решение'
                var file = new Blob([res], {type: 'text/plain;charset=utf-8'});
                saveLink.href = URL.createObjectURL(file);
                saveLink.download = 'answer.txt'
                mainDiv[0].appendChild(saveLink)
            }
        }
        delayDiv.appendChild(button)    
    }
    newDiv.appendChild(delayDiv)

    mainDiv[0].appendChild(newDiv)
    event.target.disabled = true
}

function NorthAngleMethod(matrix,matrixA,matrixB){
    rows = matrix.length
    columns = matrix[0].length
    
    matrixASum = matrixA.reduce((sum, a) => sum + a, 0)
    matrixBSum = matrixB.reduce((sum, b) => sum + b, 0)

    if(matrixASum > matrixBSum){
        matrixB.push(matrixASum - matrixBSum)
        columns++
    }

    if(matrixBSum > matrixASum){
        matrixA.push(matrixBSum - matrixASum)
        rows++
    }
    
    const result = []
    for (let i = 0; i < rows; i++) {
        result.push([])
        for (let j = 0; j < columns; j++) {
            try{
                result[i].push([0,matrix[i][j]])
                if(result[i][j][1] === undefined){
                    result[i][j][1] = 0
                }
            }
            catch(TypeError){
                result[i].push([0,0])
            }      
        }
        
    }
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            if(matrixB[j] != 0 && matrixA[i] != 0){

                if(matrixA[i] === matrixB[j]){
                    result[i][j][0] = matrixB[j]
                    matrixA[i] = 0 
                    matrixB[j] = 0
                    if(i!==rows-1 && j !== columns -1){
                        if(i+1 !== rows){
                            if(result[i+1][j][0] === 0){
                                result[i+1][j][0] = '0'
                            }
                        }
                        else if(i-1 !== rows){
                            if(result[i-1][j][0] === 0){
                                result[i-1][j][0] = '0'
                            }
                        }
                    }
                }
                else if(matrixA[i] > matrixB[j]){
                    result[i][j][0] = matrixB[j]
                    matrixA[i] = matrixA[i] - matrixB[j]
                    matrixB[j] = 0
                }
                else{
                    result[i][j][0] = matrixA[i]
                    matrixB[j] = matrixB[j] - matrixA[i]
                    matrixA[i] = 0
                }
            }
        }
    }
    count = 0
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            if(result[i][j][0] !== 0){
                count++
            }
            
        }
        
    }
    if(count == rows + columns -1){
        return result
    }
    else{
        alert('Неверные входные данные')
    }
    
    
}



function MinimalElementMethod(matrix,matrixA,matrixB){
    rows = matrix.length
    columns = matrix[0].length
    
    matrixASum = matrixA.reduce((sum, a) => sum + a, 0)
    matrixBSum = matrixB.reduce((sum, b) => sum + b, 0)

    if(matrixASum > matrixBSum){
        matrixB.push(matrixASum - matrixBSum)
        columns++
    }

    if(matrixBSum > matrixASum){
        matrixA.push(matrixBSum - matrixASum)
        rows++
    }
    
    const result = []
    for (let i = 0; i < rows; i++) {
        result.push([])
        for (let j = 0; j < columns; j++) {
            try{
                result[i].push([0,matrix[i][j]])
                if(result[i][j][1] === undefined){
                    result[i][j][1] = 0
                }
            }
            catch(TypeError){
                result[i].push([0,0])
            }      
        }
        
    }
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            if(matrixB[j] != 0 && matrixA[i] != 0){

                if(matrixA[i] === matrixB[j]){
                    result[i][j][0] = matrixB[j]
                    matrixA[i] = 0 
                    matrixB[j] = 0
                    if(i!==rows-1 && j !== columns -1){
                        if(i+1 !== rows){
                            if(result[i+1][j][0] === 0){
                                result[i+1][j][0] = '0'
                            }
                        }
                        else if(i-1 !== rows){
                            if(result[i-1][j][0] === 0){
                                result[i-1][j][0] = '0'
                            }
                        }
                    }
                }
                else if(matrixA[i] > matrixB[j]){
                    result[i][j][0] = matrixB[j]
                    matrixA[i] = matrixA[i] - matrixB[j]
                    matrixB[j] = 0
                }
                else{
                    result[i][j][0] = matrixA[i]
                    matrixB[j] = matrixB[j] - matrixA[i]
                    matrixA[i] = 0
                }
            }
        }
    }
    count = 0
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            if(result[i][j][0] !== 0){
                count++
            }
            
        }
        
    }
    if(count == rows + columns -1){
        return result
    }
    else{
        console.log('Неверные входные данные')
    }
}

function Tree(matrix,element){
    tree = []
    if(element[0] !== 0){
        for (let i = element[0]-1; i >= 0; i--) {
            if(matrix[i][element[1]] !== 0 && [i,element[1]] !== element){
                tree.push(
                    [i,element[1]]
                )
            }
        }
    }
    if(element[0] !== matrix.length-1){
        for (let i = element[0]+1; i < matrix.length; i++) {
            if(matrix[i][element[1]] !== 0 && [i,element[1]] !== element){
                tree.push(
                    [i,element[1]]
                )
            }
        }
    }
    if(element[1] !== 0){
        for (let i = element[1]-1; i >= 0; i--) {
            if(matrix[element[0]][i] !== 0 && [element[0],i] !== element){
                tree.push(
                    [element[0],i]
                )
            }
        }
    }
    if(element[1] !== matrix[0].length-1){
        for (let i = element[1]+1; i <  matrix[0].length; i++) {
            if(matrix[element[0]][i] !== 0 && [element[0],i] !== element){
                tree.push(
                    [element[0],i]
                )
            }
        }
    }
    return tree
}

function Permutation(matrix, portableItem){
    result = []
    matrix[portableItem[0]][portableItem[1]] = -1
    graph = []
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[0].length; j++) {
            if(matrix[i][j] !== 0){
                tree = Tree(matrix, [i,j])
                graph.push(
                    {
                        'position' : [i,j],
                        'direction' : tree.filter(c=> typeof(c) === typeof([]))
                    }
                )
            }   
        }
    }
    result.push(
        {
            'position' : portableItem,
            'delay' : '+'
        }
    )
    flag = true
    i = 1
    while(flag){
        path = graph.find(c=> JSON.stringify(c['position']) === JSON.stringify(result[result.length - 1]['position']))
        path['direction'] = path['direction'].filter(c=> result.some(x=> JSON.stringify(x['position']) === JSON.stringify(c))=== false)
        if(path['direction'].length > 0){
            result.push(
                {
                    'position' : path['direction'][0],
                    'delay' : result[result.length - 1]['delay'] === '+' ? '-' : '+'
                }
            )
            if(result.length > 3){
                pathDirectory = graph.find(c=> JSON.stringify(c['position']) === JSON.stringify(path['direction'][0]))
                pathDirectory['direction'] = pathDirectory['direction'].filter(c=> result.slice(1,result.length).some(x=> JSON.stringify(x['position']) === JSON.stringify(c))=== false)
                if(pathDirectory['direction'].some(c=> JSON.stringify(c) === JSON.stringify(result[0]['position']))){
                    flag = false
                }
            }
        }
        else{
            result.pop()
            tempGraph = graph.find(c=> JSON.stringify(c['position']) === JSON.stringify(result[result.length - 1]['position']))['direction']
            removeItem = tempGraph.findIndex(c=> JSON.stringify(c) === JSON.stringify(path['position']))
            tempGraph = tempGraph.filter((c,index)=> index !== removeItem)
            graph.find(c=> JSON.stringify(c['position']) === JSON.stringify(result[result.length - 1]['position']))['direction'] = tempGraph
        }
    }
    row = matrix.length
    column = matrix[0].length
    for (let i = 0; i < row; i++) {
        oneRow = result.filter(c=>c['position'][0] === i)
        if(oneRow.length > 2){
            for (let j = 1; j < oneRow.length-1; j++) {
                result.splice(result.findIndex(c=> JSON.stringify(c['position']) === JSON.stringify(oneRow[j]['position'])),1)  
            }
        }
    }
    for (let i = 0; i < column; i++) {
        oneCol = result.filter(c=>c['position'][1] === i)
        if(oneCol.length > 2){
            for (let j = 1; j < oneCol.length-1; j++) {
                result.splice(result.findIndex(c=>JSON.stringify(c['position']) === JSON.stringify(oneCol[j]['position'])),1)  
            }
        }
    }
    for (let i = 0; i < result.length; i++) {
        if(i%2===0){
            result[i]['delay'] = '+'
        }
        else{
            result[i]['delay'] = '-'
        }
        
    }
    return result
}


function Beta(matrix){
    x = []
    rows = matrix.length
    columns = matrix[0].length
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            if(matrix[i][j][0] !== 0){
                x.push(
                    `B${j+1}-A${i+1}=${matrix[i][j][1]}`
                )
            }
        }
        
    }
    result = [
        {
            'name' : 'A1',
            value : 0
        }
    ]
    while(rows + columns !== result.length){
        x = x.map(value=>{
            if(result.some(el=> value.includes(el['name']))){
                matches = value.match(/[+-]?[A-Z][0-9]+/g)
                equationTemp = value
                for (let i = 0; i < matches.length; i++) {
                    el = result.find(c=>c['name'] === matches[i].match(/[A-Z][0-9]+/g)[0])
                    if(el !== undefined){
                        equationTemp = equationTemp.replace(matches[i].match(/[A-Z][0-9]+/g),el['value'])
                    }
                }
                equation=''
                equationTemp = equationTemp.replace('--','+')
                if(equationTemp.match(/[+-]?[A-Z][0-9]+/g)!== null)
                {
                    if(equationTemp.match(/[+-]?[A-Z][0-9]+/g)[0].includes('-')){
                        equation = equationTemp.match(/=[0-9]+/g)[0]
                        equation = equation[0] + '-' + equation.substring(1,equation.length)
                        equation  = equationTemp.match(/[+-]?[A-Z][0-9]+/g)[0].replace('-','') + equation
                        equation += '+' + equationTemp.match(/[0-9]+/)[0]
                    }
                    else{
                        equation += equationTemp.match(/[+-]?[A-Z][0-9]+/g)[0] + ''
                        equation += equationTemp.match(/=[0-9]+/g)[0] + ''
                        equation += equationTemp.match(/[+-][0-9]+/g)[0].includes('-') ? equationTemp.match(/[+-][0-9]+/g)[0].replace('-','+') : equationTemp.match(/[+-][0-9]+/g)[0].replace('+','-')
                    }
                        result.push({
                            'name': equation.match(/[+-]?[A-Z][0-9]+/g)[0],
                            'value' : eval(equation.substring(equation.indexOf('=',0) +1, equation.length))
                        })
                }
                
            }
            return value
        })
    }
    
    return result
}

function Alpha(matrix,resultB){
    x = []
    rows = matrix.length
    columns = matrix[0].length
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            if(matrix[i][j][0] === 0){
                x.push(
                    `A${i+1}${j+1}=B${j+1}-A${i+1}-${matrix[i][j][1]}`
                )
            }
        }
        
    }
    result = []
    x = x.map(value=>{
        equation = value.substring(value.indexOf('=')+1,value.length)
        variables = equation.match(/[A-Z][0-9]+/g)
        variables.forEach(variable => {
            valueVariable = resultB.find(c=>c['name'] === variable)['value']
            equation = equation.replace(variable,valueVariable)
        })
        result.push({
            'name' : value.substring(0,value.indexOf('=')),
            'value' : eval(equation.replace('--','+'))
        })
        return value
    })
    return result
}

function FSumma(matrix){
    f = 0
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[0].length; j++) {
            if(matrix[i][j][0] !== 0){
                f+= matrix[i][j][0] * matrix[i][j][1]
            }
            
        }
        
    }
    return 'F=' + f
}
function PrintMatrix(matrix){
    result = ''
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[0].length; j++) {
            result += matrix[i][j][0] + '\t'
        }
        result += '\n'
    }
    return result
}
function PrintAB(AB){
    result = ''
    AB.forEach(el=>{
        result += el['name'][0] +'['+ el['name'].split('').splice(1,el['name'].length).map(c=>{return c}) +']'+ '=' + el['value']
        result += '\n'
    })
    return result
}
function PrintMatrixAB(matrixAB){
    result = ''
    for (let i = 0; i < matrixAB.length; i++) {
        result +=  matrixAB[i] + '\t'
    }
    return result
}
function PrintStartMatrix(matrix){
    result = ''
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[0].length; j++) {
            result += matrix[i][j] + '\t'
        }
        result += '\n'
    }
    return result
}
function StartMehthod(matrix,matrixA,matrixB, method){
    resultString = 'Транспортная таблица'
    resultString += '\n'
    resultString += PrintStartMatrix(matrix)
    resultString += 'Поставщики'
    resultString += '\n'
    resultString += PrintMatrixAB(matrixA)
    resultString += '\n'
    resultString += 'Потребители'
    resultString += '\n'
    resultString += PrintMatrixAB(matrixB)
    resultString += '\n'
    matrixASum = matrixA.reduce((sum, a) => sum + a, 0)
    matrixBSum = matrixB.reduce((sum, b) => sum + b, 0)
    if(matrixASum !== matrixBSum){
        resultString += 'Модель открытая'
        resultString += '\n'
        resultString += '\n'
    }
    else{
        resultString += 'Модель закрытая'
        resultString += '\n'
        resultString += '\n'
    }
    MethodMatrix = method === 0 ? NorthAngleMethod(matrix,matrixA,matrixB,resultString) : MinimalElementMethod(matrix,matrixA,matrixB)
    resultString += 'Опорный план найденный методом северо-западного угла'
    resultString += '\n'
    resultString += PrintMatrix(MethodMatrix)
    resultString += '\n'
    resultString += FSumma(MethodMatrix)
    resultString += '\n'
    resultB = Beta(MethodMatrix)
    resultString += PrintAB(resultB)
    resultString += '\n'
    resultA = Alpha(MethodMatrix, resultB)
    resultString += PrintAB(resultA)
    resultString += '\n'
    positiveElement = resultA.filter(c=>{
        if(c['value'] > 0){
            return c['value']
        }
    })
    positiveMaximumElement = positiveElement[0]['value']
    for (let i = 0; i < positiveElement.length; i++) {
        if(positiveMaximumElement < positiveElement[i]['value']){
            positiveMaximumElement = positiveElement[i]['value']
        }
        
    }
    optimally=false
    step = 1
    while(optimally === false){
        index = resultA.find(c=>c['value'] === positiveMaximumElement)['name'].split('')
        permutationMatrix = []
        for (let i = 0; i < MethodMatrix.length; i++) {
            permutationMatrix.push([])
            for (let j = 0; j < MethodMatrix[0].length; j++) {
                permutationMatrix[i].push(MethodMatrix[i][j][0])
                
            }
            
        }
        row = Number(index[1])
        column = Number(index[2])
        permutationResult = Permutation(permutationMatrix,[row-1,column-1])
        permutationResultMinimal = permutationResult[1]['position']
        for(let i = 0; i<permutationResult.length;i++){
            if(permutationResult[i]['delay'] === '-'){
                if(permutationMatrix[permutationResult[i]['position'][0]][permutationResult[i]['position'][1]] < permutationMatrix[permutationResultMinimal[0]][permutationResultMinimal[1]]){
                    permutationResultMinimal = permutationResult[i]['position']
                }
            }
        }
        // 1 2
        delayElement = MethodMatrix[permutationResultMinimal[0]][permutationResultMinimal[1]][0]
        for(let i = 0; i < permutationResult.length;i++){
            if(permutationResult[i]['delay'] === '-'){
                MethodMatrix[permutationResult[i]['position'][0]][permutationResult[i]['position'][1]][0]  = parseInt(MethodMatrix[permutationResult[i]['position'][0]][permutationResult[i]['position'][1]][0]) - delayElement 
            }
            else{
                MethodMatrix[permutationResult[i]['position'][0]][permutationResult[i]['position'][1]][0]  = parseInt(MethodMatrix[permutationResult[i]['position'][0]][permutationResult[i]['position'][1]][0]) + delayElement 
            }
        }
        resultB = Beta(MethodMatrix)
        resultA = Alpha(MethodMatrix, resultB)
        resultString += `Шаг ${step}:`
        resultString += '\n'
        resultString += PrintMatrix(MethodMatrix)
        resultString += '\n'
        resultString += FSumma(MethodMatrix)
        resultString += '\n'
        resultString += PrintAB(resultB)
        resultString += '\n'
        resultString += PrintAB(resultA)
        resultString += '\n'
        positiveElement = resultA.filter(c=>{
            if(c['value'] > 0){
                return c['value']
            }
        })
        positiveMaximumElement = undefined
        if(positiveElement.length !== 0 ){
            positiveMaximumElement =positiveElement[0]['value']
            for (let i = 0; i < positiveElement.length; i++) {
                if(positiveMaximumElement < positiveElement[i]['value']){
                    positiveMaximumElement = positiveElement[i]['value']
                }
                
            }
            if(positiveMaximumElement === undefined){
                optimally = true
            }
        }
        else{
            optimally = true
        }
        step ++;
    }
    step--
    resultString = resultString.replace(`Шаг ${step}:`, 'Оптимальный план') 
    return resultString
}

function takeFile(files){
    var mainDiv = document.getElementsByClassName('enter-data')
    mainDiv = mainDiv[0]
    if(document.getElementsByClassName('table').length !== 0){
        mainDiv.removeChild(document.getElementsByClassName('table')[0])
    }
    //txt
    const file = files[0]
    if(file.type === 'text/plain')
    {
        const reader = new FileReader();
        reader.addEventListener('load', (event) => {
            const result = event.target.result
            matrixs = result.split('-')
            matrix = []
            matrixA = []
            matrixB = []
            for (let i = 0; i < matrixs.length; i++) {
                switch(i){
                    case 0:
                        let rows = matrixs[i].split('\n')
                        rows = rows.splice(0,rows.length-1)
                        for (let j = 0; j < rows.length; j++) {
                            matrix.push([])
                            let rowElements = rows[j].split(',')
                            rowElements.forEach(el=>{
                                matrix[j].push(el)
                            })
                        }
                        break
                    case 1:
                        let rowElementsMatrixA =  matrixs[i].split('\n')
                        rowElementsMatrixA = rowElementsMatrixA.splice(1,rowElementsMatrixA.length-2)
                        rowElementsMatrixA = rowElementsMatrixA[0].split(',')
                        rowElementsMatrixA.forEach(el=>{
                            matrixA.push(el)
                        })
                        break
                    case 2:
                        let rowElementsMatrixB =  matrixs[i].split('\n')
                        rowElementsMatrixB = rowElementsMatrixB.splice(1,rowElementsMatrixB.length)
                        rowElementsMatrixB = rowElementsMatrixB[0].split(',')
                        rowElementsMatrixB.forEach(el=>{
                            matrixB.push(el)
                        })
                        break
                }
            }
            var mainDiv = document.getElementsByClassName('enter-data')
                var newDiv = document.createElement('div')
                newDiv.className = 'table'
                var tableTitle = document.createTextNode('Транспортная таблица')
                newDiv.appendChild(tableTitle)
                var row = document.getElementById('row')
                var col = document.getElementById('col')
                row.disabled = true
                col.disabled = true
                row.value = matrix.length
                col.value = matrix[0].length
                row = matrix.length
                col = matrix[0].length
                
                for (let i = 0; i < row; i++) {
                    var newRow = document.createElement('div')
                    newRow.className = 'row'
                    for (let j = 0; j < col; j++) {
                        var newCol = document.createElement('input')
                        newCol.className = 'col'
                        newCol.type = 'number'
                        newCol.min = '0'
                        newCol.value = matrix[i][j]
                        newRow.appendChild(newCol)
                    }
                    newDiv.appendChild(newRow)
                }
                
                var matrixATitle = document.createTextNode('Поставщики')
                newDiv.appendChild(matrixATitle)
                var matrixADiv = document.createElement('div')
                matrixADiv.className = 'matrix-a'
                var newRow = document.createElement('div')
                newRow.className = 'row'
                for (let i = 0; i < row; i++) {
                    var newCol = document.createElement('input')
                    newCol.className = 'col'
                    newCol.type = 'number'
                    newCol.min = '0'
                    newCol.value = matrixA[i]
                    newRow.appendChild(newCol)
                }
                matrixADiv.appendChild(newRow)
                newDiv.appendChild(matrixADiv)

                var matrixBTitle = document.createTextNode('Потребители')
                newDiv.appendChild(matrixBTitle)
                var matrixBDiv = document.createElement('div')
                matrixBDiv.className = 'matrix-b'
                var newRow = document.createElement('div')
                newRow.className = 'row'
                for (let i = 0; i < col; i++) {
                    var newCol = document.createElement('input')
                    newCol.className = 'col'
                    newCol.type = 'number'
                    newCol.min = '0'
                    newCol.value = matrixB[i]
                    newRow.appendChild(newCol)
                }
                matrixBDiv.appendChild(newRow)
                newDiv.appendChild(matrixBDiv)

                var delayDiv = document.createElement('div')
                delayDiv.className = '.delay-button-line'
                for (let i = 0; i < 2; i++) {
                    var button = document.createElement('input')
                    button.type = 'button'
                    if(i === 0){
                        button.value = 'Очистить'
                        button.onclick = () => {
                            var cells = document.getElementsByClassName('col')
                            for (let i = 0; i < cells.length; i++) {
                                cells[i].value = '0'
                            }
                        }
                    }
                    else{
                        button.value = 'Рассчитать'
                        button.onclick = ()=>{
                            var matrix = []
                            var table = document.getElementsByClassName('table')
                            table = table[0]
                            var row = document.getElementById('row')
                            var col = document.getElementById('col')
                            row = row.value
                            col = col.value

                            for (let i = 0; i < row; i++) {
                                var rows = table.children[i]
                                matrix.push([])
                                for (let j = 0; j < col; j++) {
                                    matrix[i].push(parseInt(rows.children[j].value))
                                }
                                
                            }
                            var matrixA = []
                            var matrixADiv = document.getElementsByClassName('matrix-a')
                            matrixADiv = matrixADiv[0].children[0]
                            for (let i = 0; i < matrixADiv.children.length; i++) {
                                matrixA.push(parseInt(matrixADiv.children[i].value))
                                
                            }
                            var matrixB = []
                            var matrixBDiv = document.getElementsByClassName('matrix-b')
                            matrixBDiv = matrixBDiv[0].children[0]
                            for (let i = 0; i < matrixBDiv.children.length; i++) {
                                matrixB.push(parseInt(matrixBDiv.children[i].value))
                            }
                            res = StartMehthod(matrix,matrixA,matrixB,0)
                            var mainDiv = document.getElementsByClassName('enter-data')
                            var p = document.createElement('p')
                            p.innerText = res
                            mainDiv[0].appendChild(p)
                            let saveLink = document.createElement('a')
                            saveLink.innerText = 'Сохранить решение'
                            var file = new Blob([res], {type: 'text/plain;charset=utf-8'});
                            saveLink.href = URL.createObjectURL(file);
                            saveLink.download = 'answer.txt'
                            mainDiv[0].appendChild(saveLink)
                        }
                    }
                    delayDiv.appendChild(button)    
                }
                newDiv.appendChild(delayDiv)

                mainDiv[0].appendChild(newDiv)
                event.target.disabled = true
        });
        reader.readAsBinaryString(file)
    }
    else if(file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'){
        var xl2json = new ExcelToJSON();
        xl2json.parseExcel(file);
    }
    else{
        alert('Выбран неверный формат файла')
        console.log('Выбран неверный формат файла')
        console.error('file extention not valid')
    }
}