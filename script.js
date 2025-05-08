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
        document.getElementById('previewPhone').innerHTML = `<a class="whatsapp" target="_blank" style="text-decoration: none; color: black;" href="https://wa.me/+55${phone.replace(/[^0-9]/g, '')}">WhatsApp: ${phone} </a>`;
    } else {
        document.getElementById('previewPhone').innerHTML = `<a class="whatsapp" style="text-decoration: none; color: black;" href="tel:${phone.replace(/[^0-9]/g, '')}">${phone}</a> | <a class="whatsapp" style="text-decoration: none; color: black;" href="tel:${phone2.replace(/[^0-9]/g, '')}">${phone2}</a>`;
    }

    // Manipulação da foto
    if (noPhoto) {
        document.getElementById('photoCell').style.display = 'none';
    } else {
        document.getElementById('photoCell').style.display = 'table-cell';

        if (photoFile) {
            // Arquivo local
            processImage(photoFile, function (processedImageDataUrl) {
                uploadToFirebase(processedImageDataUrl, photoFile.name);
            });
        } else if (slackImageUrl) {
            // Imagem externa do Slack
            processImage(slackImageUrl, function (processedImageDataUrl) {
                document.getElementById('avatar').src = processedImageDataUrl;
            });
        } else {
            // Exibir avatar padrão
            document.getElementById('avatar').src = './Assets/Avatar-placeholder.png';
        }
    }
}

function processImage(source, callback) {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    const size = 150;

    img.crossOrigin = 'Anonymous';

    img.onload = function () {
        canvas.width = size;
        canvas.height = size;

        ctx.clearRect(0, 0, size, size);
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(img, 0, 0, size, size);

        const dataUrl = canvas.toDataURL('image/png');
        callback(dataUrl);
    };

    if (typeof source === 'string') {
        img.src = source;
    } else {
        const reader = new FileReader();
        reader.onload = function (e) {
            img.src = e.target.result;
        };
        reader.readAsDataURL(source);
    }
}

function uploadToFirebase(dataUrl, fileName) {
    const storageRef = firebase.storage().ref(`imagens/${fileName}`);

    fetch(dataUrl)
        .then(res => res.blob())
        .then(blob => {
            return storageRef.put(blob);
        })
        .then(() => storageRef.getDownloadURL())
        .then(url => {
            document.getElementById('avatar').src = url;
            console.log('URL da imagem: ', url);
        })
        .catch(error => {
            console.error('Erro ao processar imagem para Firebase: ', error);
        });
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
    apiKey: 'AIzaSyAh8u2-9hMt4zxiB-InJo7vwJBKJP5PwS8',
    authDomain: 'fotos-assinatura.firebaseapp.com',
    projectId: 'fotos-assinatura',
    storageBucket: 'fotos-assinatura.appspot.com',
    messagingSenderId: '76819168790',
    appId: '1:76819168790:web:673533901af6720755ff37'
};


const app = firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();