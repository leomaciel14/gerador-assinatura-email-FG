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

    if (whatsappChecked) {
        document.getElementById('previewPhone').innerHTML = `<a class="whatsapp" target="_blank" href="https://wa.me/+55${phone.replace(/[^0-9]/g, '')}">WhatsApp: ${phone} </a>`;
    } else {
        document.getElementById('previewPhone').innerHTML = `<a class="whatsapp" href="tel:${phone.replace(/[^0-9]/g, '')}">${phone}</a> | <a class="whatsapp" href="tel:${phone2.replace(/[^0-9]/g, '')}">${phone2}</a>`;
    }

    if (noPhoto) {
        document.getElementById('photoCell').style.display = 'none';
    } else {
        document.getElementById('photoCell').style.display = 'table-cell';
        if (photoFile) {
            const reader = new FileReader();
            reader.onload = function (e) {
                applyFrameToImage(e.target.result);
            }
            reader.readAsDataURL(photoFile);
        }
    }

    function applyFrameToImage(imageUrl) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const frameImage = new Image();
        const userImage = new Image();

        userImage.onload = function () {
            canvas.width = userImage.width;
            canvas.height = userImage.height;
            ctx.drawImage(userImage, 0, 0);
            frameImage.onload = function () {
                ctx.drawImage(frameImage, 0, 0, userImage.width, userImage.height);
                document.getElementById('avatar').src = canvas.toDataURL();
            }
            frameImage.src = './Assets/Moldura.png';
        }
        userImage.src = imageUrl;
    }
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
