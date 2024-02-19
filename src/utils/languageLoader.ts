import fs from 'fs'


function getLanguageFiles() {
    /* we open folder translations and go through each folder.
    In each folder, there are subfolder representing languages.
    In those subfolders, there are json files representing the translations.

    We get jsons, add them to dlc category (which is located in manifest.json) and dlc category to the language
    * */
    console.log("111")
    const languages = {}
    const dlc = {}
    const translations = {}
    const translationPath = '../translations/'
    const folders = fs.readdirSync(translationPath)
    console.log(folders)
    for (const folder of folders) {
        const languagePath = translationPath + folder
        const languageFolders = fs.readdirSync(languagePath)
        console.log(folder)
        // for (const languageFolder of languageFolders) {
        //     const languageFiles = fs.readdirSync(languagePath + '/' + languageFolder)
        //     for (const languageFile of languageFiles) {
        //         const language = languageFile.split('.')[0]
        //         const languageJson = JSON.parse(fs.readFileSync(languagePath + '/' + languageFolder + '/' + languageFile, 'utf8'))
        //         if (!languages[language]) {
        //             languages[language] = {}
        //         }
        //         languages[language][folder] = languageJson
        //         if (!dlc[folder]) {
        //             dlc[folder] = []
        //         }
        //         dlc[folder].push(language)
        //         translations[folder] = languages
        //     }
        // }
    }
    return 1
}


export default getLanguageFiles