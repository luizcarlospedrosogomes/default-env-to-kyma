const k8s = require('@kubernetes/client-node');
const base64 = require('base-64');
const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

const main = async () => {    
    const namespace = process.argv[2];
    const secretName = process.argv[3];
    getSecret(namespace, secretName);
};

const getSecret = (namespace, secretName) => {
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