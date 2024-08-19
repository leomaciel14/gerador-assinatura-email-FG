document.getElementById('checkboxWhatsapp').addEventListener('change', function () {
    const phoneLabel = document.getElementById('phoneLabel');
    const phoneInput = document.getElementById('phone');
    if (this.checked) {
        phoneLabel.style.display = 'block';
        phoneInput.style.display = 'block';
    } else {
        phoneLabel.style.display = 'none';
        phoneInput.style.display = 'none';
    }
});

function generateSignature() {
    const name = document.getElementById('name').value;
    const position = document.getElementById('position').value;
    const whatsappChecked = document.getElementById('checkboxWhatsapp').checked;
    const phone = whatsappChecked ? document.getElementById('phone').value : '11 4319-0315';
    const phone2 = '11 4319-0317';
    const photoFile = document.getElementById('photo').files[0];
    const slackImageUrl = document.getElementById('slackImageUrl').value.trim();
    const noPhoto = document.getElementById('checkboxPhoto').checked;

    // Atualizar nome e posição
    document.getElementById('previewName').textContent = name;
    document.getElementById('previewPosition').textContent = position;

    // Atualizar telefone
    if (whatsappChecked) {
        document.getElementById('previewPhone').innerHTML = `<a class="whatsapp" target="_blank" style="text-decoration: none;" href="https://wa.me/+55${phone.replace(/[^0-9]/g, '')}">WhatsApp: ${phone} </a>`;
    } else {
        document.getElementById('previewPhone').innerHTML = `<a class="whatsapp" style="text-decoration: none; color: black;" href="tel:${phone.replace(/[^0-9]/g, '')}">${phone}</a> | <a class="whatsapp" style="text-decoration: none; color: black;" href="tel:${phone2.replace(/[^0-9]/g, '')}">${phone2}</a>`;
    }

    // Manipulação da foto
    if (noPhoto) {
        document.getElementById('photoCell').style.display = 'none';
    } else {
        document.getElementById('photoCell').style.display = 'table-cell';

        if (photoFile) {
            // Processar e carregar a imagem do arquivo local
            processImage(photoFile, function (processedImageDataUrl) {
                const storageRef = firebase.storage().ref(`imagens/${photoFile.name}`);
                
                // Converter a imagem processada (data URL) para um arquivo Blob
                fetch(processedImageDataUrl)
                    .then(res => res.blob())
                    .then(blob => {
                        // Fazer o upload do Blob para o Firebase
                        storageRef.put(blob).then(() => {
                            // Obter a URL da imagem após o upload
                            storageRef.getDownloadURL().then((url) => {
                                document.getElementById('avatar').src = url;
                                console.log('URL da imagem: ', url);
                            }).catch((error) => {
                                console.error("Erro ao obter a URL da imagem:", error);
                            });
                        }).catch((error) => {
                            console.error("Erro ao fazer o upload da imagem:", error);
                        });
                    });
            });
        } else if (slackImageUrl) {
            // Carregar a imagem do Slack
            document.getElementById('avatar').src = slackImageUrl;
        } else {
            // Exibir avatar padrão se nenhuma imagem for selecionada
            document.getElementById('avatar').src = './Assets/Avatar-placeholder.png';
        }
    }
}

function processImage(file, callback) {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    // Defina as dimensões desejadas para a imagem
    const size = 150;  // Largura e altura da imagem

    img.onload = function() {
        // Configurando o tamanho do canvas
        canvas.width = size;
        canvas.height = size;

        // Desenhando o círculo de recorte
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();

        // Desenhando a imagem no canvas com o clip aplicado
        ctx.drawImage(img, 0, 0, size, size);

        // Convertendo o canvas para data URL (base64)
        const dataUrl = canvas.toDataURL('image/png');
        callback(dataUrl);
    };

    // Lendo o arquivo como URL
    const reader = new FileReader();
    reader.onload = function(e) {
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function copySignature() {
    const signaturePreview = document.getElementById('signaturePreview');
    const clone = signaturePreview.cloneNode(true);
    const button = clone.querySelector('button');
    if (button) {
        button.remove();
    }

    const tempElement = document.createElement('div');
    tempElement.appendChild(clone);

    document.body.appendChild(tempElement);

    const range = document.createRange();
    range.selectNodeContents(tempElement);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);

    try {
        document.execCommand('copy');
        alert('Assinatura copiada para a área de transferência!');
    } catch (err) {
        console.error('Erro ao copiar a assinatura: ', err);
    }

    document.body.removeChild(tempElement);
}

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID
};


const app = firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();