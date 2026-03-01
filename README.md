# AI Destekli Akıllı Finans Takipçisi

Bu proje, harcamalarınızı hem TL hem de USD bazında takip edebileceğiniz, AI asistan destekli modern bir finans yönetim platformudur.

## Özellikler

*   **Çoklu Para Birimi**: Canlı döviz kuru ile harcamalar hem ₺ hem de $ bazında gösterilir.
*   **AI Finans Asistanı**: Kahve alışkanlıklarınızı analiz eder ve %20'ye varan tasarruf önerileri sunar.
*   **Dinamik Grafikler**: Harcama kategorilerini görselleştirir (Recharts).
*   **Supabase Entegrasyonu**: Verilerinizi güvenle saklar ve kullanıcı bazlı oturum yönetimi sunar.

## Kurulum ve Çalıştırma

1.  Bağımlılıkları yükleyin:
    ```bash
    npm install
    ```

2.  `.env.local` dosyasını oluşturun (veya `.env.example` üzerinden kopyalayın) ve Supabase bilgilerini girin.

3.  Geliştirme sunucusunu başlatın:
    ```bash
    npm run dev
    ```

## GitHub'a Yükleme Adımları

Eğer git yüklü ise terminalinizden aşağıdaki komutları çalıştırarak projenizi GitHub'a gönderebilirsiniz:

```powershell
# Git'i başlat
git init

# Dosyaları ekle ve ilk commit'i yap
git add .
git commit -m "İlk sürüm: AI Finans Takipçisi"

# GitHub deposunu bağla (Örn: https://github.com/kullaniciadi/finance-tracker.git)
git remote add origin [REPO_URL_BURAYA]

# Ana dalı belirle ve gönder
git branch -M main
git push -u origin main
```

## Vercel Deployment (Dağıtım)

1.  [Vercel](https://vercel.com/new) hesabınıza giriş yapın.
2.  GitHub deponuzu Vercel'e bağlayın.
3.  **Environment Variables** kısmına aşağıdaki değişkenleri ekleyin:
    *   `NEXT_PUBLIC_SUPABASE_URL`
    *   `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4.  "Deploy" butonuna basın. Projeniz hazır!

## Teknolojiler

*   [Next.js](https://nextjs.org/)
*   [Supabase](https://supabase.com/)
*   [Tailwind CSS](https://tailwindcss.com/)
*   [Recharts](https://recharts.org/)
*   [Lucide React](https://lucide.dev/)
