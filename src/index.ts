const k8s = require('@kubernetes/client-node');
const base64 = require('base-64');
const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

const main = async () => {
   /* try {
        const podsRes = await k8sApi.listNamespacedPod('default');
        k8sApi.get
    } catch (err) {
        console.error(err);
    }*/
    getSecret()
};

const getSecret = () => {
    k8sApi.readNamespacedSecret("sprolims-authentication-binding", "spro-lims")
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
    });
}
main();