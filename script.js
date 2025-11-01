// Parse URL parameters from QR code link
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        // Common payment parameters
        phone: params.get('phone') || params.get('p'),
        amount: params.get('amount') || params.get('a'),
        description: params.get('description') || params.get('desc') || params.get('d'),
        merchant: params.get('merchant') || params.get('m'),
        merchantId: params.get('merchantId') || params.get('mid'),
        accountId: params.get('accountId') || params.get('aid'),
        cardNumber: params.get('cardNumber') || params.get('card'),
        businessName: params.get('businessName') || params.get('name'),
        
        // Payment method specific parameters
        paymePhone: params.get('paymePhone') || params.get('pp'),
        clickMerchant: params.get('clickMerchant') || params.get('cm'),
        uzumPhone: params.get('uzumPhone') || params.get('up'),
        paynetPhone: params.get('paynetPhone') || params.get('pnp'),
        apelsinPhone: params.get('apelsinPhone') || params.get('ap'),
        humoCard: params.get('humoCard') || params.get('hc'),
    };
}

// Store payment information from URL
const paymentInfo = getUrlParams();

// Payment configuration - Deep link templates for each payment method
const paymentConfig = {
    payme: {
        // PayMe deep link format
        buildAppUrl: () => {
            const phone = paymentInfo.paymePhone || paymentInfo.phone;
            const amount = paymentInfo.amount ? `&amount=${paymentInfo.amount}` : '';
            const desc = paymentInfo.description ? `&description=${encodeURIComponent(paymentInfo.description)}` : '';
            return `payme://transfer?phone=${encodeURIComponent(phone)}${amount}${desc}`;
        },
        buildWebUrl: () => {
            const phone = paymentInfo.paymePhone || paymentInfo.phone;
            const params = new URLSearchParams({ phone });
            if (paymentInfo.amount) params.append('amount', paymentInfo.amount);
            if (paymentInfo.description) params.append('description', paymentInfo.description);
            return `https://payme.uz/transfer?${params.toString()}`;
        }
    },
    click: {
        buildAppUrl: () => {
            const merchant = paymentInfo.clickMerchant || paymentInfo.merchantId || paymentInfo.merchant;
            const phone = paymentInfo.phone;
            const amount = paymentInfo.amount ? `&amount=${paymentInfo.amount}` : '';
            return `click://payment?merchant=${encodeURIComponent(merchant)}&phone=${encodeURIComponent(phone)}${amount}`;
        },
        buildWebUrl: () => {
            const params = new URLSearchParams();
            if (paymentInfo.clickMerchant || paymentInfo.merchantId || paymentInfo.merchant) {
                params.append('merchant', paymentInfo.clickMerchant || paymentInfo.merchantId || paymentInfo.merchant);
            }
            if (paymentInfo.phone) params.append('phone', paymentInfo.phone);
            if (paymentInfo.amount) params.append('amount', paymentInfo.amount);
            return `https://click.uz/services/payment?${params.toString()}`;
        }
    },
    uzum: {
        buildAppUrl: () => {
            const phone = paymentInfo.uzumPhone || paymentInfo.phone;
            const amount = paymentInfo.amount ? `&amount=${paymentInfo.amount}` : '';
            const desc = paymentInfo.description ? `&description=${encodeURIComponent(paymentInfo.description)}` : '';
            return `uzum://transfer?phone=${encodeURIComponent(phone)}${amount}${desc}`;
        },
        buildWebUrl: () => {
            const phone = paymentInfo.uzumPhone || paymentInfo.phone;
            const params = new URLSearchParams({ phone });
            if (paymentInfo.amount) params.append('amount', paymentInfo.amount);
            if (paymentInfo.description) params.append('description', paymentInfo.description);
            return `https://uzum.uz/transfer?${params.toString()}`;
        }
    },
    paynet: {
        buildAppUrl: () => {
            const phone = paymentInfo.paynetPhone || paymentInfo.phone;
            const account = paymentInfo.accountId ? `&account=${encodeURIComponent(paymentInfo.accountId)}` : '';
            const amount = paymentInfo.amount ? `&amount=${paymentInfo.amount}` : '';
            return `paynet://payment?phone=${encodeURIComponent(phone)}${account}${amount}`;
        },
        buildWebUrl: () => {
            const phone = paymentInfo.paynetPhone || paymentInfo.phone;
            const params = new URLSearchParams({ phone });
            if (paymentInfo.accountId) params.append('account', paymentInfo.accountId);
            if (paymentInfo.amount) params.append('amount', paymentInfo.amount);
            return `https://paynet.uz?${params.toString()}`;
        }
    },
    apelsin: {
        buildAppUrl: () => {
            const phone = paymentInfo.apelsinPhone || paymentInfo.phone;
            const merchant = paymentInfo.merchantId ? `&merchant=${encodeURIComponent(paymentInfo.merchantId)}` : '';
            const amount = paymentInfo.amount ? `&amount=${paymentInfo.amount}` : '';
            return `apelsin://transfer?phone=${encodeURIComponent(phone)}${merchant}${amount}`;
        },
        buildWebUrl: () => {
            const phone = paymentInfo.apelsinPhone || paymentInfo.phone;
            const params = new URLSearchParams({ phone });
            if (paymentInfo.merchantId) params.append('merchant', paymentInfo.merchantId);
            if (paymentInfo.amount) params.append('amount', paymentInfo.amount);
            return `https://apelsin.uz?${params.toString()}`;
        }
    },
    humo: {
        buildAppUrl: () => {
            const card = paymentInfo.humoCard || paymentInfo.cardNumber;
            const phone = paymentInfo.phone;
            const amount = paymentInfo.amount ? `&amount=${paymentInfo.amount}` : '';
            return `humo://transfer?card=${encodeURIComponent(card)}&phone=${encodeURIComponent(phone)}${amount}`;
        },
        buildWebUrl: () => {
            const params = new URLSearchParams();
            if (paymentInfo.humoCard || paymentInfo.cardNumber) {
                params.append('card', paymentInfo.humoCard || paymentInfo.cardNumber);
            }
            if (paymentInfo.phone) params.append('phone', paymentInfo.phone);
            if (paymentInfo.amount) params.append('amount', paymentInfo.amount);
            return `https://humo.uz?${params.toString()}`;
        }
    }
};

// Display payment information if available
function displayPaymentInfo() {
    if (paymentInfo.businessName || paymentInfo.amount || paymentInfo.description) {
        const infoHtml = `
            <div class="payment-info">
                ${paymentInfo.businessName ? `<p class="business-name">${paymentInfo.businessName}</p>` : ''}
                ${paymentInfo.amount ? `<p class="payment-amount">${formatAmount(paymentInfo.amount)} UZS</p>` : ''}
                ${paymentInfo.description ? `<p class="payment-desc">${paymentInfo.description}</p>` : ''}
            </div>
        `;
        const header = document.querySelector('header');
        header.insertAdjacentHTML('afterend', infoHtml);
    }
}

// Format amount with thousand separators
function formatAmount(amount) {
    const num = parseFloat(amount);
    if (isNaN(num)) return amount;
    return num.toLocaleString('uz-UZ');
}

// Initialize payment buttons
document.addEventListener('DOMContentLoaded', function() {
    // Display payment info from URL
    displayPaymentInfo();
    
    const paymentCards = document.querySelectorAll('.payment-card');
    
    paymentCards.forEach(card => {
        card.addEventListener('click', function() {
            const paymentType = this.getAttribute('data-payment');
            handlePayment(paymentType);
        });
        
        // Add touch feedback
        card.addEventListener('touchstart', function() {
            this.classList.add('active');
        });
        
        card.addEventListener('touchend', function() {
            setTimeout(() => {
                this.classList.remove('active');
            }, 150);
        });
    });
    
    // Validate that required payment info is present
    if (!paymentInfo.phone && !paymentInfo.merchant && !paymentInfo.merchantId) {
        console.warn('No payment information found in URL. Payment links may not work correctly.');
        console.warn('Expected URL format: ?phone=+998901234567&amount=10000&description=Payment');
    }
});

function handlePayment(paymentType) {
    const config = paymentConfig[paymentType];
    
    if (!config) {
        console.error('Payment method not configured');
        return;
    }
    
    // Build URLs dynamically with payment information from URL params
    const appUrl = config.buildAppUrl();
    const webUrl = config.buildWebUrl();
    
    // Mobile-friendly deep linking
    // Try app first, fallback to web after delay
    let appOpened = false;
    
    // Track if app opens (page loses focus)
    const blurHandler = function() {
        appOpened = true;
        window.removeEventListener('blur', blurHandler);
        window.removeEventListener('visibilitychange', visibilityHandler);
    };
    
    const visibilityHandler = function() {
        if (document.hidden) {
            appOpened = true;
            window.removeEventListener('blur', blurHandler);
            window.removeEventListener('visibilitychange', visibilityHandler);
        }
    };
    
    window.addEventListener('blur', blurHandler);
    window.addEventListener('visibilitychange', visibilityHandler);
    
    // Attempt to open app with pre-filled payment details
    window.location.href = appUrl;
    
    // Fallback to web after delay if app didn't open
    setTimeout(() => {
        if (!appOpened) {
            // Check if still on page
            if (document.hasFocus() && !document.hidden) {
                window.location.href = webUrl;
            }
        }
        window.removeEventListener('blur', blurHandler);
        window.removeEventListener('visibilitychange', visibilityHandler);
    }, 1500);
}

