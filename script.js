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
    const noPhoto = document.getElementById('checkboxPhoto').checked;

    document.getElementById('previewName').textContent = name;
    document.getElementById('previewPosition').textContent = position;

    // Atualizar telefone
    if (whatsappChecked) {
        document.getElementById('previewPhone').innerHTML = `<a class="whatsapp" target="_blank" style="text-decoration: none; color: black;" href="https://wa.me/+55${phone.replace(/[^0-9]/g, '')}">WhatsApp: ${phone}</a>`;
    } else {
        document.getElementById('previewPhone').innerHTML = `
            <a style="text-decoration: none; color: black;" href="tel:${phone.replace(/[^0-9]/g, '')}">${phone}</a> | 
            <a style="text-decoration: none; color: black;" href="tel:${phone2.replace(/[^0-9]/g, '')}">${phone2}</a>`;
    }

    // Foto
    if (noPhoto) {
        document.getElementById('photoCell').style.display = 'none';
    } else {
        document.getElementById('photoCell').style.display = 'table-cell';

        if (photoFile) {
            const reader = new FileReader();
            reader.onload = (e) => {
                processImageUrl(e.target.result)
                    .then(blob => uploadToFirebase(blob, photoFile.name))
                    .catch(() => alert("Erro ao processar a imagem local"));
            };
            reader.readAsDataURL(photoFile);
        } else {
            // Se não houver foto, colocar a imagem padrão
            document.getElementById('avatar').src = './Assets/Avatar-placeholder.png';
        }
    }
}

function processImageUrl(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            const size = 256;
            canvas.width = size;
            canvas.height = size;

            const cropSize = Math.min(img.width, img.height);
            const offsetX = (img.width - cropSize) / 2;
            const offsetY = (img.height - cropSize) / 2;

            ctx.drawImage(img, offsetX, offsetY, cropSize, cropSize, 0, 0, size, size);

            canvas.toBlob((blob) => {
                if (blob) resolve(blob);
                else reject("Erro ao gerar blob da imagem.");
            }, 'image/png');
        };
        img.onerror = () => reject("Erro ao carregar imagem.");
        img.src = url;
    });
}

function uploadToFirebase(blob, fileName) {
    const storageRef = firebase.storage().ref(`imagens/${fileName}`);
    storageRef.put(blob)
        .then(() => storageRef.getDownloadURL())
        .then(url => {
            document.getElementById('avatar').src = url;
            console.log('Imagem salva: ', url);
        })
        .catch(error => {
            console.error("Erro ao fazer upload: ", error);
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