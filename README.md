# Payment Methods Website - Uzbekistan

A mobile-optimized one-page website designed to work as a QR code link from your business app. When users scan the QR code, they see payment method icons. Clicking an icon opens the corresponding payment app with pre-filled business owner payment details from the URL parameters.

## Features

- 📱 **Mobile-First Design** - Optimized for mobile devices with touch-friendly interface
- 🎨 **Modern UI** - Clean, gradient background with card-based layout
- 💳 **Multiple Payment Methods** - Supports PayMe, Click, Uzum, Paynet, Apelsin, and Humo
- 🔗 **Dynamic Deep Linking** - Payment details are passed via URL parameters and automatically included in payment links
- 💰 **QR Code Compatible** - Designed to work with QR codes from your business app
- 📊 **Payment Info Display** - Shows business name, amount, and description when provided in URL

## How It Works

The website reads payment information from URL parameters (passed through QR code) and includes them in the payment links when users select a payment method.

### URL Parameter Format

Your business app should generate URLs in this format:

```
https://yourdomain.com/index.html?phone=+998901234567&amount=10000&description=Payment&businessName=My Business
```

### Supported URL Parameters

**Common Parameters:**
- `phone` or `p` - Business phone number (used for most payment methods)
- `amount` or `a` - Payment amount
- `description` or `desc` or `d` - Payment description
- `businessName` or `name` - Business name (displayed on page)
- `merchant` or `m` - Merchant ID
- `merchantId` or `mid` - Merchant ID (alternative)
- `accountId` or `aid` - Account ID (for Paynet)
- `cardNumber` or `card` - Card number (for Humo)

**Payment Method-Specific Parameters:**
- `paymePhone` or `pp` - PayMe-specific phone number
- `clickMerchant` or `cm` - Click-specific merchant ID
- `uzumPhone` or `up` - Uzum-specific phone number
- `paynetPhone` or `pnp` - Paynet-specific phone number
- `apelsinPhone` or `ap` - Apelsin-specific phone number
- `humoCard` or `hc` - Humo-specific card number

### Example URLs

**Basic Payment:**
```
https://yourdomain.com/index.html?phone=+998901234567&amount=50000
```

**Full Payment with Description:**
```
https://yourdomain.com/index.html?phone=+998901234567&amount=50000&description=Product Purchase&businessName=My Shop
```

**Multiple Payment Methods (Different Accounts):**
```
https://yourdomain.com/index.html?phone=+998901234567&paymePhone=+998901234567&uzumPhone=+998987654321&clickMerchant=12345&amount=100000
```

## Setup Instructions

1. **Deploy the Website**
   - Upload the files (`index.html`, `styles.css`, `script.js`) to your web hosting
   - Or use a static hosting service like GitHub Pages, Netlify, or Vercel

2. **Generate QR Code Links from Your Business App**
   - Create URLs with payment parameters
   - Generate QR codes pointing to these URLs
   - Customers scan the QR code and select a payment method

3. **Test the Integration**
   - Generate a test QR code with payment parameters
   - Scan it on a mobile device
   - Verify that payment details are pre-filled when opening payment apps

## Payment Methods Supported

- **PayMe** - payme.uz
- **Click** - click.uz  
- **Uzum** - uzum.uz
- **Paynet** - paynet.uz
- **Apelsin** - apelsin.uz
- **Humo** - humo.uz

## Integration with Your Business App

### Example Code to Generate QR Code URL

```javascript
// JavaScript example
function generatePaymentURL(amount, description, businessName) {
    const baseURL = 'https://yourdomain.com/index.html';
    const params = new URLSearchParams({
        phone: '+998901234567', // Your business phone
        amount: amount.toString(),
        description: description,
        businessName: businessName
    });
    return `${baseURL}?${params.toString()}`;
}

// Generate and display QR code
const paymentURL = generatePaymentURL(50000, 'Coffee Purchase', 'Coffee Shop');
// Use a QR code library to generate the QR code image
```

### Android Example (Java/Kotlin)

```kotlin
fun generatePaymentURL(amount: Int, description: String): String {
    val baseURL = "https://yourdomain.com/index.html"
    return Uri.parse(baseURL)
        .buildUpon()
        .appendQueryParameter("phone", "+998901234567")
        .appendQueryParameter("amount", amount.toString())
        .appendQueryParameter("description", description)
        .build()
        .toString()
}
```

### iOS Example (Swift)

```swift
func generatePaymentURL(amount: Int, description: String) -> String {
    var components = URLComponents(string: "https://yourdomain.com/index.html")!
    components.queryItems = [
        URLQueryItem(name: "phone", value: "+998901234567"),
        URLQueryItem(name: "amount", value: String(amount)),
        URLQueryItem(name: "description", value: description)
    ]
    return components.url!.absoluteString
}
```

## Customization

### Change Payment Deep Link Formats

Edit the `buildAppUrl()` and `buildWebUrl()` functions in `script.js` to match your payment service's actual deep link formats.

### Modify UI

- Edit `styles.css` to change colors, spacing, and layout
- Edit `index.html` to add/remove payment methods or change icons

## Browser Support

Works on all modern mobile browsers:
- Safari (iOS)
- Chrome (Android)
- Samsung Internet
- Firefox Mobile

## Testing

1. Test URL with parameters directly:
   ```
   https://yourdomain.com/index.html?phone=+998901234567&amount=10000&businessName=Test&description=Test Payment
   ```

2. Verify that:
   - Payment info is displayed correctly on the page
   - Each payment method link includes the correct parameters
   - Deep links open the apps with pre-filled information

## Notes

- Deep link formats may need adjustment based on actual payment app implementations
- Some payment services may require specific parameter formats or additional authentication
- Test on actual devices to ensure deep links work correctly
- URL parameters should be properly URL-encoded (the script handles this automatically)
