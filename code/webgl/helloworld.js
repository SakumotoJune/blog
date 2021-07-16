function mian() {
    const canvas = document.querySelector('#glCanvas');
    const gl = canvas.getContext('webgl');
    if(gl === null) {
        console.log('浏览器不支持');
        return;
    }

    var program = gl.createProgram();
    var vShader = gl.createShader(gl.VERTEX_SHADER);
    var fShader = gl.createShader(gl.FRAGMENT_SHADER);
    
    gl.shaderSource(vShader, gl.VSHADER_SOURCE);
    gl.shaderSource(fShader, gl.FSHADER_SOURCE);

    gl.compileShader(vShader);
    gl.compileShader(fShader);

    gl.attachShader(program, vShader);
    gl.attachShader(program, fShader);

    gl.linkProgram(program);

    gl.useProgram(program);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0 ,1);
}

mian();