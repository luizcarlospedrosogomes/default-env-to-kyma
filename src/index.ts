const k8s = require('@kubernetes/client-node');
const base64 = require('base-64');
const kc = new k8s.KubeConfig();
const path = require("path")
const main = async () => {    
    const isFileConfig = process.argv.find(arg => arg.startsWith('--file='))
    
    if(isFileConfig){
        const caminhoArquivo = process.argv.find(arg => arg.startsWith('--file=')).slice(7);
        kc.loadFromFile(path.resolve(caminhoArquivo));
    }else{
        kc.loadFromDefault();
    }
    const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
    
    const namespace = process.argv[2];
    const secretName = process.argv[3];
    getSecret(namespace, secretName, k8sApi);
};

const getSecret = (namespace, secretName, k8sApi) => {
    k8sApi.readNamespacedSecret(secretName, namespace)
    .then((res) => {
        // Obtém os dados da Secret
        const data = res.body.data;
        
        // Decodifica os valores base64
        const decodedData = {};
        for (const [key, value] of Object.entries(data)) {
        decodedData[key] = base64.decode(value);
        }
        console.log(JSON.stringify(decodedData, null, 2));
        // Exibe os valores decodificados
        /*for (const [key, value] of Object.entries(decodedData)) {
        console.log(`${key}: ${value}`);
        }*/
    })
    .catch((err) => {
        console.error('Error:', err);
        console.error('Error:', err.message);
    });
}
main();