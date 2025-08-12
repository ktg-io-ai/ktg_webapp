Core System Components:
1. Wallet Manager ( wallet-manager.js)
✅ Token Management : Handles 1, 3, 6 and 9 life tokens ($1.99-$9.99 each) plus available Special Token for $999.00 which is the Diamond Buy Token require to Buy a real Certified Diamond at Discount and play the game to reveal the value.  And there will be occasional Random Prize GiveAways of high priced Diamonds.

✅ 30-Day Expiration : Automatic token expiration and cleanup - Optional renewable INDEFINITELY for applied tokens warning emails sent with apply and buy buttons and popup when you click wallet. 

✅ Persistent Storage : Firebase integration for wallet data

✅ Crypto Wallet Support : Field for linking external crypto wallets

✅ Transaction History : Tracks all token usage and additions

2. Game Registration Manager
✅ Destiny Registration : Uses 3-life token by default, any token accepted

✅ Chess Registration : (1) 1 Life Token ($1,99) per AI opponent (1-life tokens)

✅ Session Management : Tracks active games and expiration

✅ Token Validation : Ensures sufficient tokens before registration

3. Avatar Manager
✅ 3 Generation Limit : First gen from basic info, 2 more with custom prompts

✅ Gender Memory : System prompt remembers gender choice

✅ Image Cycling : After 3 gens, cycles through existing images

✅ Wallet Persistence : Avatar linked to wallet, wallet keep record of tokens used per Avatar as "Age of Avatar" 5 Tokens Old is (5) 30 Day Periods showing longevity in the Stats of the Avatar - data survives avatar termination - user can withdraw the tokens and it will delete the memory of the wallet of those tokens.

Registration Flow:
1. Opening Page ( opening.html)
✅ Registration Modal : Token selection interface

✅ Wallet Display : Shows current token counts

✅ Login Check : Redirects to login if not authenticated

✅ Token Selection : Visual grid with prices and availability

2. New Wallet ( newwallet.html)
✅ Firebase Integration : Creates wallet with email/password

✅ Starter Tokens : Gives 1-life and 3-life tokens to new users

✅ Validation : Password strength and email format checking

✅ Persistent Identity : Email/walletID never needs re-registration

3. Avatar Creation ( newavatar.html)
✅ Gender Selection : Male/Female/Other with visual selection

✅ Name & Tagline : Avatar identity for classified ad posts

✅ Live Preview : Generates avatar preview as user types

✅ First Generation : Automatic avatar creation from basic choices

4. Avatar Customization ( makeavatar.html)
✅ 3 Generation System : Tracks and limits avatar generations

✅ Custom Prompts : Detailed avatar customization with AI

✅ Image Cycling : Post-limit cycling through generated images

✅ Play Button : Proceeds to door selection when satisfied

Key Features:
Zap System Logic
✅ Wallet-Level Separation : Zapper/zappee never see each other again - Any size Token only buys 10 Zaps per 30 day cycle.  After that you must use Hide to remove unwanted profiles from your Grid.

✅ Second Chances : Zappee has other remaining lives to play with other players - zaps are recorded both ways and viewable in the Stats of the player scene Number of Zaps Received - Number of Zaps - 

✅ Karma Concept : "Karma the Game of Destiny" - redemption possible

Token Economics
✅ Destiny : 3-life token average, any token accepted

✅ Chess : 1-life token per AI opponent - free for P2P - Active Player registers to play in the lobby.  Chooses to wait for other players or play AI Opponent or a mix.

✅ 30-Day Expiration : All tokens expire, encouraging active play

✅ Flexible Pricing : 1-9 life tokens for different commitment levels - Token Packs are offered - VR Concerts and events are paid for with any token size the promoter wants to charge  VR also plays on desktop. (partially ready for integration with the webapp)

Avatar System
✅ Classified Ad Proxy : Avatar represents the user's post

✅ Terminable : Users can delete avatars and create new ones - Bail Link on My Stuff allows for self termination or just to logout.

✅ Persistent Wallet : Email/wallet survives avatar changes

✅ Door Integration : Avatar connects to chosen door/world - Values, Compatibility or Intimacy (Blue, Yellow, Red) (chooseyourdoor)

The system is now ready for Firebase backend integration