const express = require('express');
const fs = require("fs");
const path = require('path');
const { exec } = require('child_process');
const axios = require('axios');
const { parseString } = require('xml2js');

const app = express();
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;

const inputFilePath = './public/scad/angbu.scad';
const outputFilePath = './public/stl/angbuilgu.stl';

const filePath = "/public/stl/angbuilgu.stl";
let fileSize;

let stlFlag;


const deleteSTLContents = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.truncate(filePath, 0, (error) => {
            if (error) {
                console.error(`Error deleting STL file contents: ${error.message}`);
                reject(error);
            } else {
                console.log('STL file contents deleted successfully');
                resolve();
            }
        });
    });
};

function convertSCADtoSTL(inputFilePath, outputFilePath, latitude, declination, callback) {
    const command = `openscad -o ${outputFilePath} -D "latitude=${latitude}" -D "declination=${declination}" ${inputFilePath}`;
    console.log("start converting to stl!");
    exec(command, (error, stdout, stderr) => {
        console.log("end");
        if (error) {
            console.error(`Error executing command: ${error}`);
            return callback(error);
        }

        if (stderr) {
            console.error(`Command error output: ${stderr}`);
            return callback(new Error(stderr));
        }

        console.log(`Conversion successful. Output file: ${outputFilePath}`);
        callback(null);
    });
}

app.get('/', (req, res) => {
    console.log("index");
    res.sendFile(__dirname + "/public/main.html");
});

app.get('/location', (req, res) => {
    console.log('location');
    res.sendFile(__dirname + "/public/location.html");
});

app.get('/location/decl', (req, res) => {
    const apiUrl = `https://www.ngdc.noaa.gov/geomag-web/calculators/calculateDeclination?lat1=${req.query.lat}&lon1=${req.query.lon}&key=zNEw7&resultFormat=xml`;

    axios.get(apiUrl)
        .then(response => {
            const xmlData = response.data;

            parseString(xmlData, (error, result) => {
                if (error) {
                    console.error('Error parsing XML:', error);
                    return;
                }
                const magneticDeclination = result.maggridresult.result[0].declination[0]._.replace('\n', '');
                res.json({ "declination": magneticDeclination });
            });
        })
        .catch(error => {
            res.json({ "declination": null });
        });
})

async function fileTextModify(req, res, next) {
    let latitudeMod = req.query.latitude;
    let declinationMod = req.query.decl;
    fileSize = await fs.statSync(__dirname + filePath).size;
    try {
        deleteSTLContents(__dirname + filePath);
    } catch (e) {
        console.log("파일이 존재하지 않아 내용을 삭제하지 못하였습니다.");
    }
    stlFlag = 0;
    convertSCADtoSTL(inputFilePath, outputFilePath, latitudeMod, declinationMod, (error) => {
        if (error) {
            console.error('Conversion failed.');
        } else {
            stlFlag = 1;
            console.log("successfully modified.");
        }
    });
    next();
}

app.get('/loadstl', fileTextModify, (req, res, next) => {
    res.sendFile(__dirname + "/public/loadstl.html");
})

app.get('/loadstl/progress', (req, res) => {
    let progress;
    try {
        let currentSize = fs.statSync(__dirname + filePath).size;
        progress = Math.round((currentSize / fileSize) * 100);
    } catch (e) {
        console.log("아직 파일 생성 전입니다.");
        progress = 0;
    }
    if (stlFlag === 1) {
        res.json({
            "progress": 100,
            "end": true
        });
    } else {
        if (progress === null) {
            progress = 0;
        }
        res.json({
            "progress": progress,
            "end": false
        });
    }
})

app.get('/download', (req, res) => {
    let file = path.join(__dirname, filePath);
    res.download(file, 'angbuilgu.stl', (err) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error downloading file");
        }
    })
})


app.get('/download/student', (req, res) => {
    let value = req.headers.cookie.match('(^|;) ?' + 'lang' + '=([^;]*)(;|$)');
    let language = value ? value[2] : null;
    if (language === 'ko') {
        let file = path.join(__dirname, "/public/학습지/앙부일구 실험서(학생용).pdf");
        res.download(file, '앙부일구 실험서(학생용).pdf', (err) => {
            if (err) {
                console.error(err);
                res.status(500).send("Error downloading file");
            }
        })
    } else {
        let file = path.join(__dirname, "/public/학습지/exploring_the_principles_of_angbuilgu_forStudents.pdf");
        res.download(file, 'exploring_the_principles_of_angbuilgu_forStudents.pdf', (err) => {
            if (err) {
                console.error(err);
                res.status(500).send("Error downloading file");
            }
        })
    }
})
app.get('/download/teacher', (req, res) => {
    let value = req.headers.cookie.match('(^|;) ?' + 'lang' + '=([^;]*)(;|$)');
    let language = value ? value[2] : null;
    if (language === 'ko') {
        let file = path.join(__dirname, "/public/학습지/앙부일구 실험서(교사용).pdf");
        res.download(file, '앙부일구 실험서(교사용).pdf', (err) => {
            if (err) {
                console.error(err);
                res.status(500).send("Error downloading file");
            }
        })
    } else {
        let file = path.join(__dirname, "/public/학습지/exploring_the_principles_of_angbuilgu_forTeachers.pdf");
        res.download(file, '/public/학습지/exploring_the_principles_of_angbuilgu_forTeachers.pdf', (err) => {
            if (err) {
                console.error(err);
                res.status(500).send("Error downloading file");
            }
        })
    }

})

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}/`);
})