const { storage } = require('../config/firebase.js');
const { ref, uploadBytesResumable, getDownloadURL, deleteObject, updateMetadata, getMetadata } = require('firebase/storage');
const { getGlobal } = require('@firebase/util');
const Module = require('../models/Module')
const User = require('../models/User');
const ResourceLink = require('../models/ResourceLinks');
const modulesController = {};
var idModulo, idModuloTest;



// CREAR MÓDULO
modulesController.renderModuleForm = (req, res) => {
    res.render('modulesCourse/newModule', { name: req.user.name })
}

modulesController.createNewModule = async (req, res) => {
    let urlImg;
    const nameVideos = [];
    const referenceURL = [];
    const datosVideos = {};
    // let nameDocs = [];
    // const referenceURLsDocs = [];
    var arrDataVideos = [];
    // let documents = req.files.docs;
    const { _id, nameModule, nameAuthor, descriptionModule } = req.body;
    const videos = Object.assign({}, req.files);
    let nameModuleReady = await Module.findOne({ nameModule: nameModule });

    if (nameModuleReady) {
        console.log("Nombre OCUPADO");
        req.flash('error_msg', 'El nombre del módulo ya se encuentra en uso, por favor use otro nombre.');
        res.redirect('/modulesCourse/add');
    }


    let storageRefImg = ref(storage, `${nameModule}/${req.files.img.name}`);
    let uploadImg = uploadBytesResumable(storageRefImg, req.files.img.data);

    // SUBIENDO LA IMAGEN
    uploadImg.on('state_changed',
        (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
                case 'paused':
                    console.log('Upload is paused');
                    break;
                case 'running':
                    console.log('Upload is running');
                    break;
            }
        },
        (error) => {
            // console.log(error);
            req.flash('error_msg', 'Hubo un error, vuelva a intentelor.');
            res.redirect('/viewsAdmi/admi');
        },
        () => {
            getDownloadURL(uploadImg.snapshot.ref).then((downloadURL) => {
                console.log('File available at', downloadURL);
                urlImg = downloadURL;
            });
        }
    );



    videos.file.forEach(function (element) {
        console.log(decodeURIComponent(escape(element.name)));
        nameVideos.push(decodeURIComponent(escape(element.name)));
    });


    // SUBIENDO DOCUMENTOS
    // if (documents) {
    //     if (documents.length > 1) {
    //         documents.forEach(function (element) {
    //             let storageRefDocs = ref(storage, `${nameModule}/${element.name}`);
    //             let uploadDocs = uploadBytesResumable(storageRefDocs, element.data);
    //             uploadDocs.on('state_changed',
    //                 (snapshot) => {
    //                     const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    //                     console.log('Upload is ' + progress + '% done');
    //                     switch (snapshot.state) {
    //                         case 'paused':
    //                             // console.log('Upload is paused');
    //                             break;
    //                         case 'running':
    //                             // console.log('Upload is running');
    //                             break;
    //                     }
    //                 },
    //                 (error) => {
    //                     // console.log(error);
    //                     req.flash('error_msg', 'Hubo un error, vuelva a intentelor.');
    //                     res.redirect('/viewsAdmi/admi');
    //                 },
    //                 () => {
    //                     getDownloadURL(uploadDocs.snapshot.ref).then((downloadURL) => {
    //                         // console.log('File available at', downloadURL);
    //                         // referenceURLsDocs.push(downloadURL);
    //                         // nameDocs.push(element.name);
    //                     });
    //                 }
    //             );


    //         })
    //     } else {
    //         let storageRefDocs = ref(storage, `${nameModule}/${req.files.docs.name}`);
    //         let uploadDocs = uploadBytesResumable(storageRefDocs, req.files.docs.data);

    //         uploadDocs.on('state_changed',
    //             (snapshot) => {
    //                 const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    //                 console.log('Upload is ' + progress + '% done');
    //                 switch (snapshot.state) {
    //                     case 'paused':
    //                         // console.log('Upload is paused');
    //                         break;
    //                     case 'running':
    //                         // console.log('Upload is running');
    //                         break;
    //                 }
    //             },
    //             (error) => {
    //                 // console.log(error);
    //                 req.flash('error_msg', 'Hubo un error, vuelva a intentelor.');
    //                 res.redirect('/viewsAdmi/admi');
    //             },
    //             () => {
    //                 getDownloadURL(uploadDocs.snapshot.ref).then((downloadURL) => {
    //                     //console.log('File available at', downloadURL);
    //                     // referenceURLsDocs.push(downloadURL);
    //                     // nameDocs.push(req.files.docs.name);
    //                 });
    //             }
    //         );
    //     }

    // } 

    // SUBIENDO VIDEOS


    videos.file.forEach(function (element) {
        let storageRef = ref(storage, `${nameModule}/${decodeURIComponent(escape(element.name))}`);
        let uploadTask = uploadBytesResumable(storageRef, element.data);

        uploadTask.on('state_changed', (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload is ${progress} % done ${decodeURIComponent(escape(element.name))}`);
            switch (snapshot.state) {
                case 'paused':
                    console.log('Upload is paused');
                    break;
                case 'running':
                    console.log('Upload is running');
                    break;
            }
        },
            (error) => {
                // console.log(error);
                req.flash('error_msg', 'Hubo un error, vuelva a intentelor.');
                res.redirect('/viewsAdmi/admi');
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                    console.log('File available at', downloadURL);
                    referenceURL.push(downloadURL);
                    //nameVideos.push(`${element.name}`);
                    datosVideos[`${decodeURIComponent(escape(element.name))}`] = downloadURL

                    if (referenceURL.length == videos.file.length) {
                        // INSERTANDO DATOS
                        arrDataVideos = Object.entries(datosVideos);

                        arrDataVideos.sort();
                        //nameVideos.sort();


                        const newModule = new Module({
                            id: _id,
                            nameModule: nameModule,
                            nameAuthor: nameAuthor,
                            descriptionModule: descriptionModule,
                            referenceURLs: referenceURL,
                            nameVideos: nameVideos,
                            dataVideos: arrDataVideos,
                            img: urlImg
                        });
                        let nuevoModulo = await newModule.save();
                        idModuloTest = nuevoModulo._id;


                        if (req.body.cuestionario) {
                            req.flash('success_msg', 'Módulo cargado, ahora puede añadir un cuestionario.');
                            res.redirect('/modulesCourse/renderTestForm');
                        } else {
                            req.flash('success_msg', 'Módulo creado correctamente.');
                            res.redirect('/viewsAdmi/admi');
                        }

                    }
                });
            });
    });

}


// AÑADIR TEST
modulesController.renderTestForm = (req, res) => {
    res.render('modulesCourse/addTest');
}

modulesController.addTest = async (req, res) => {
    const ObjetoAsk = Object.assign({}, req.body);
    const preguntas = Object.values(ObjetoAsk);

    await Module.findByIdAndUpdate(idModuloTest, { test: preguntas });
    req.flash('success_msg', 'Cuestionario cargado exitosamente.');
    res.redirect('/viewsAdmi/admi');

}



// MOSTRAR LISTA DE VÍDEOS
modulesController.showModule = async (req, res) => {
    const module = await Module.findById(req.params.id);
    // Datos PDF
    let resourcesModules = await ResourceLink.find();
    let datosPDF = Object.assign({}, resourcesModules);

    idModulo = req.params.id;
    console.log(module)
    let nameVideos = module.nameVideos;
    let urls = module.referenceURLs;
    let data = Object.fromEntries(module.dataVideos);
    let test = module.test;

    let url = data[`${nameVideos[0]}`]
    // let docs = module.referenceURLsDocs;
    // let nameDocs = module.nameDocs;

    if(resourcesModules.length != 0) {
        res.render('modulesCourse/showModule', { name: req.params.name, links: url, nameVideos, id: req.params.id, test, resourcesModule: true, urlSource: datosPDF['0'].resourceURL });
    } else {
        res.render('modulesCourse/showModule', { name: req.params.name, links: url, nameVideos, id: req.params.id, test, resourcesModule: false });
    }
    
}

modulesController.renderVideo = async (req, res) => {
    const module = await Module.findById(idModulo);
     // Datos PDF
     let resourcesModules = await ResourceLink.find();
     let datosPDF = Object.assign({}, resourcesModules);

    let nameVideos = module.nameVideos;
    let data = Object.fromEntries(module.dataVideos);
    let url = data[`${req.params.name}`];
    let test = module.test;
    // let docs = module.referenceURLsDocs;
    // let nameDocs = module.nameDocs;

    if(resourcesModules.length != 0) {
        res.render('modulesCourse/renderVideo', { nameVideos, id: idModulo, url, test, resourcesModule: true, urlSource: datosPDF['0'].resourceURL });
    } else {
        res.render('modulesCourse/renderVideo', { nameVideos, id: idModulo, url, test, resourcesModule: false});
    }

   
}



// CUESTIONARIO
modulesController.renderTest = async (req, res) => {
    const module = await Module.findById(idModulo);
    let preguntas = module.test
    res.render('modulesCourse/test', { preguntas });
}



// RESULTADOS
modulesController.resultsTest = async (req, res) => {
    const module = await Module.findById(idModulo);
    let nameModule = module.nameModule;
    let preguntas = module.test;
    let respuestasUsuario = req.body.respuestas;
    let respuestasCorrectas = [];
    let totalPreguntas = preguntas.length;
    let promedio = 0;
    var respuestasAsertadas = 0;


    for (let i = 0; i < preguntas.length; i++) {
        respuestasCorrectas.push(preguntas[i][5])
    }

    for (let i = 0; i < respuestasCorrectas.length; i++) {
        if (respuestasCorrectas[i] == respuestasUsuario[i]) {
            respuestasAsertadas++;
        }
    }

    promedio = (respuestasAsertadas * 100) / totalPreguntas;

    if (promedio >= 80) {
        console.log(req.user);
        const user = await User.findById(req.user._id);
        let progress = user.avances;
        let newProgress = { nameModule: nameModule, resultado: promedio };
        progress.push(newProgress);
        await User.findByIdAndUpdate(user._id, { avances: progress });

    }

    res.render('modulesCourse/resultsTest', { totalPreguntas, respuestasAsertadas, promedio, user: req.user, nameModule });
}



// ACTUALIZAR MÓDULO
modulesController.renderUpdateModule = async (req, res) => {
    const module = await Module.findById(req.params.id);
    res.render('modulesCourse/updateModule', { module });
}

modulesController.updateModule = async (req, res) => {
    const module = await Module.findById(req.params.id);
    var nameModule;
    let nameAuthor = module.nameAuthor;
    let descriptionModule = module.descriptionModule;
    const videos = Object.assign({}, req.files);
    const nameVideos = [];
    const referenceURL = [];
    const datosVideos = {};
    var arrDataVideos = [];
    let urlImg;

    // COMPARANDO SI LOS CAMPOS CAMBIARON
    if (module.nameModule === req.body.nameModule) {
        nameModule = module.nameModule;
    } else {
        nameModule = req.body.nameModule;
    }

    if ((req.body.file == '' && req.body.img == '') || req.files == null) {
        await Module.findByIdAndUpdate(req.params.id, {
            nameModule: nameModule,
            nameAuthor: req.body.nameAuthor,
            descriptionModule: req.body.descriptionModule
        });

        req.flash('success_msg', 'Módulo actualizado exitosamente');
        res.redirect('/viewsAdmi/admi');

    } else {
        let storageRefImg = ref(storage, `${nameModule}/${req.files.img.name}`);
        let uploadImg = uploadBytesResumable(storageRefImg, req.files.img.data);

        // ACTUALIZAR IMAGEN
        uploadImg.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case 'paused':
                        console.log('IMG Upload is paused');
                        break;
                    case 'running':
                        console.log('IMG Upload is running');
                        break;
                }
            },
            (error) => {
                // console.log(error);
                req.flash('success_msg', 'Actualizado');
                res.redirect('/viewsAdmi/admi');
            },
            () => {

                getDownloadURL(uploadImg.snapshot.ref).then(async (downloadURL) => {
                    console.log('File available at', downloadURL);
                    urlImg = downloadURL;
                });
            }
        );
        // FIN IMG


        // ACTUALIZAR VIDEOS
        videos.file.forEach(function (element) {
            let storageRef = ref(storage, `${nameModule}/${element.name}`);
            let uploadTask = uploadBytesResumable(storageRef, element.data);

            uploadTask.on('state_changed', (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log(`Upload is ${progress} % done`);
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                }
            },
                (error) => {
                    // console.log(error);
                    req.flash('success_msg', 'Actualizado');
                    res.redirect('/viewsAdmi/admi');
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                        console.log('File available at', downloadURL);
                        // INSERTANDO DATOS URL
                        referenceURL.push(downloadURL);
                        nameVideos.push(`${element.name}`);
                        datosVideos[`${element.name}`] = downloadURL;


                        if (referenceURL.length == videos.file.length) {
                            arrDataVideos = Object.entries(datosVideos);
                            arrDataVideos.sort();
                            nameVideos.sort();
                            const newModule = await Module.findByIdAndUpdate(req.params.id,
                                {
                                    nameModule: nameModule,
                                    nameAuthor: req.body.nameAuthor,
                                    descriptionModule: req.body.descriptionModule,
                                    referenceURLs: referenceURL,
                                    nameVideos: nameVideos,
                                    dataVideos: arrDataVideos,
                                    img: urlImg
                                });
                            // console.log(newModule);
                            req.flash('success_msg', 'Actualizado');
                            res.redirect('/viewsAdmi/admi');
                        }
                    });
                });
        });
        // FIN VIDEOS
    }
}



// DELETE MÓDULE 
modulesController.deleteModule = async (req, res) => {
    const module = await Module.findByIdAndDelete(req.params.id);
    req.flash('success_msg', `Módulo "${module.nameModule}" eliminado exitosamente.`);
    res.redirect('/viewsAdmi/admi');
}


// MOSTRAR RECURSOS (LINKS)
modulesController.resourcesModules = async (req, res) => {

    let resourcesModules = await ResourceLink.find();
    let datosPDF = Object.assign({}, resourcesModules);

    if(resourcesModules.length != 0) {
        res.render('modulesCourse/resourcesModules', { name: datosPDF['0'].nameResource, url: datosPDF['0'].resourceURL });
    } else {
        res.render('modulesCourse/resourcesModules', {noResources: true});
    }

    
}


modulesController.createResourcesModule = async (req, res) => {
    const nameFolder = "Recursos módulo";
    let storageRefPDF = ref(storage, `${nameFolder}/${req.files.pdf.name}`);
    let createPDF = uploadBytesResumable(storageRefPDF, req.files.pdf.data);

    const newMetadata = {
        contentType: 'application/pdf',
        customMetadata: 'application/pdf'
    }

    createPDF.on('state_changed',
        (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
                case 'paused':
                    console.log('Upload is paused');
                    break;
                case 'running':
                    console.log('Upload is running');
                    break;
            }
        },
        (error) => {
            req.flash('error_msg', 'Hubo un error, vuelva a intentelor.');
            res.redirect('/viewsAdmi/admi');
        },
        () => {
            getDownloadURL(createPDF.snapshot.ref).then(async (downloadURL) => {

                await updateMetadata(storageRefPDF, newMetadata)
                    .then((metadata) => {

                    }).catch((error) => {
                        req.flash('error_msg', 'Hubo un error, vuelva a intentelor.');
                        res.redirect('/viewsAdmi/admi');
                    });


                    const newResource = new ResourceLink ({
                        nameResource: req.files.pdf.name,
                        resourceURL: downloadURL
                    });


                    await newResource.save();


                req.flash('success_msg', `Archivo ${req.files.pdf.name} subido correctamente.`);
                res.redirect('/modulesCourse/resourcesModules');

            });
        }
    );
}


modulesController.updateResourcesModules = async (req, res) => {

    const nameFolder = "Recursos módulo";
    let storageRefPDF = ref(storage, `${nameFolder}/${req.files.pdf.name}`);
    let uploadPDF = uploadBytesResumable(storageRefPDF, req.files.pdf.data);

    const newMetadata = {
        contentType: 'application/pdf',
        customMetadata: 'application/pdf'
    }

    let deletePDF = ref(storage, `${nameFolder}/${req.params.name}`);

    deleteObject(deletePDF).then(() => {
        console.log(`${req.params.name} Eliminado de firebase`)
      }).catch((error) => {
        console.log("Hubo un error");
      });

    // SUBIENDO LA PDF
    uploadPDF.on('state_changed',
        (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
                case 'paused':
                    console.log('Upload is paused');
                    break;
                case 'running':
                    console.log('Upload is running');
                    break;
            }
        },
        (error) => {
            req.flash('error_msg', 'Hubo un error, vuelva a intentelor.');
            res.redirect('/viewsAdmi/admi');
        },
        () => {
            getDownloadURL(uploadPDF.snapshot.ref).then(async (downloadURL) => {

                await updateMetadata(storageRefPDF, newMetadata)
                    .then((metadata) => {

                    }).catch((error) => {
                        req.flash('error_msg', 'Hubo un error, vuelva a intentelor.');
                        res.redirect('/viewsAdmi/admi');
                    });


                await ResourceLink.findOneAndUpdate({ nameResource: req.params.name },
                    {
                        nameResource: req.files.pdf.name,
                        resourceURL: downloadURL
                    })

                req.flash('success_msg', `Archivo ${req.files.pdf.name} actualizado correctamente.`);
                res.redirect('/modulesCourse/resourcesModules');

            });
        }
    );




}

module.exports = modulesController;

