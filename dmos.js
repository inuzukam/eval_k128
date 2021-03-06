Array.prototype.shuffle = function()
{
    var i = this.length;
    while (i) {
        var j = Math.floor(Math.random() * i);
        var t = this[--i];
        this[i] = this[j];
        this[j] = t;
    }
    return this;
}

function loadText(filename)
{
    var xhr = new XMLHttpRequest();
    xhr.open("GET", filename, false);
    xhr.send(null);
    var data = xhr.responseText.split(/\r\n|\r|\n/);

    return data;
}

function makePairs()
{
    const N = sp_name.length;
    const M = method.length;
    var pairs = new Array(N * M);

    for (var i=0; i<N; i++) {
        for (var j=0; j<M; j++) {
            pairs[i*M+j] = [sp_name[i], method[j]];
        }
    }

    pairs.shuffle();
    
    return pairs;
}

function makeFileList()
{
    var files = Array(pairs.length);
    for (var i=0; i<pairs.length; i++) {
        sub_file = "" + wav_dir + "/" + pairs[i][0] + "_" 
            + pairs[i][1] + ".wav";
        ref_file = "" + wav_dir + "/" + pairs[i][0] + "_" 
            + ref + ".wav";
        files[i] = [sub_file, ref_file];
    }

    return files;
}

function evalCheck()
{
    const c = scores[n];
    if ((c <= 0) || (c > eval.length)) {
        for (var i=0; i<eval.length; i++) {
            eval[i].checked = false;
        }
    }
    else {
        eval[c-1].checked = true;
    }
}

function setButton()
{
    if (n == scores.length - 1) {
        document.getElementById("prev").disabled=false;
        document.getElementById("next").disabled=true;
        document.getElementById("finish").disabled=true;
        for (var i=0; i<eval.length; i++) {
            if (eval[i].checked) {
                document.getElementById("finish").disabled=false;
                break;
            }
        }
    }
    else {
        if (n == 0) {
            document.getElementById("prev").disabled=true;
        }
        else {
            document.getElementById("prev").disabled=false;
        }
        document.getElementById("next").disabled=true;
        document.getElementById("finish").disabled=true;
        for (var i=0; i<eval.length; i++) {
            if (eval[i].checked) {
                document.getElementById("next").disabled=false;
                break;
            }
        }
    }
}


function evaluation()
{
    for (var i=0; i<eval.length; i++){
        if (eval[i].checked){
            scores[n] = i+1;
        }
    }
    setButton();
    // showScores();
}


function showScores()
{
    var r = Math.floor(scores.length / 10);
    var table = "";
    for(var i=0; i<r; i++){
        for(var j=0; j<10; j++){
            table += scores[i*10+j] + " ";
        }
        table += "<br>";
    }
    for(var j=0; j<scores.length%10; j++){
        table += scores[r*10+j] + " ";
    }
    document.getElementById("table").innerHTML = table;
}

function setAudio()
{
    document.getElementById("page").textContent = "" + (n+1) + "/" + scores.length;
    document.getElementById("ref").innerHTML = '参照音<br>'
            + '<audio src="' + file_list[n][1]
            + '" controls preload="auto">'
            + '</audio>';
    document.getElementById("sub").innerHTML = '評価音<br>'
        + '<audio src="' + file_list[n][0]
        + '" controls preload="auto">'
        + '</audio>';
    showLabels();
}

function exportCSV()
{
    var csvData = "";
    for (var i=0; i<pairs.length; i++) {
        csvData += "" + pairs[i][0] + "," 
            + pairs[i][1] + "," + scores[i] + "\r\n";
    }

    const link = document.createElement("a");
    document.body.appendChild(link);
    link.style = "display:none";
    const blob = new Blob([csvData], {type: "octet/stream"});
    const url = window.URL.createObjectURL(blob);
    link.href = url;
    link.download = outfile;
    link.click();
    window.URL.revokeObjectURL(url);
    link.parentNode.removeChild(link);
}


function showLabels()
{
    const _name = pairs[n][0];
    var idx;
    var labels = "";

    for (var i=0; i<sp_name.length; i++) {
        if (label_list[i][0] == _name) {
            idx = i;
            break;
        }
    }
    console.log(_name);
    for (var i=1; i<label_list[idx].length; i++){
        labels += label_list[idx][i] + ", "
    }
    document.getElementById("label").textContent = 
        "ラベル : " + labels;
}


function init()
{
    n = 0;
    setAudio();
    evalCheck();
    setButton();
    // showScores();
}

function next()
{
    n++;
    setAudio();
    evalCheck();
    setButton();
}

function prev()
{
    n--;
    setAudio();
    evalCheck();
    setButton();
}

function finish()
{
    exportCSV();
}

// --------- 設定 --------- //

// ディレクトリ名
const wav_dir = "wav";
// 音声の名前(prefix)のリストのファイル名
const name_file = "name.txt";
// 手法の名前(suffix)のリストのファイル名
const method_file = "method.txt";
// 参照音声（接尾辞 suffix）の名前
const ref = "tar";
// 出力ファイル名
const outfile = "dmos.csv";

// ------------------------ //

const label_list = [
    ['00', '乗り物', 'エンジン音（高周波）'],
    ['01', 'ハンマー・かなづち'],
    ['02', '蛇口から流れる水', 'ポンプによる水流の音', '水流'],
    ['03', '細断・破壊音'],
    ['04', 'チェーンソー', '電動工具'],
    ['05', '液体が波打つ音', '話し声', '屋外・自然の音'],
    ['06', 'シーッと言う声', '吠える声', 'ペット', 'ワンワン', '犬'],
    ['07', '音楽', '子守唄', '水流'],
    ['08', 'レジ'],
    ['09', '草刈り機', '乗り物', '話し声'],
    ['10', '吠える声', 'ペット', 'ワンワン', '話し声', '犬', 'せき', '動物'],
    ['11', '蛇口から流れる水', 'お風呂', '水流'],
    ['12', 'エンジンがかかる音'],
    ['13', '猫', 'ペット', 'うなり声', '動物'],
    ['14', '鳥類', '大型の水鳥', '液体が波打つ音', '話し声']
];

const sp_name = loadText(name_file);
const method = loadText(method_file);
//const sp_name = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14'];
//const method = ['VQ+GL', 'VCTK', 'AudioSet', 'VCTK+AudioSet'];
var pairs = makePairs();
var file_list = makeFileList();
console.log(file_list);

var n = 0;
var eval = document.getElementsByName("eval");
var scores = (new Array(file_list.length)).fill(0);
