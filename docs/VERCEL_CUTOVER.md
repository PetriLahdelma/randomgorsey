# Vercel Domain Cutover

Last reviewed: March 10, 2026

## Current live DNS

The current public DNS still points at GitHub Pages:

- `randomgorsey.com` resolves to `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
- `www.randomgorsey.com` is a CNAME to `petrilahdelma.github.io`

## Recommended target state

Vercel currently documents two supported approaches:

1. Keep DNS with the current registrar/provider and point records at Vercel
2. Delegate nameservers to Vercel

For this project, the cleanest low-risk cutover is usually to keep the current DNS provider and update only the required records.

Vercel recommends using `www` as the primary domain and redirecting the apex domain to it for better CDN control and reliability.

## External DNS provider cutover

After the Vercel project is created and both domains are added there:

1. Add `randomgorsey.com` to the Vercel project
2. Add `www.randomgorsey.com` to the same Vercel project
3. Set `www.randomgorsey.com` as the primary domain in Vercel
4. Configure a redirect from `randomgorsey.com` to `www.randomgorsey.com`
5. Replace the existing GitHub Pages DNS records with the Vercel records below

### Remove

- `A @ 185.199.108.153`
- `A @ 185.199.109.153`
- `A @ 185.199.110.153`
- `A @ 185.199.111.153`
- `CNAME www petrilahdelma.github.io`

### Add

- `A @ 76.76.21.21`
- `CNAME www cname.vercel-dns-0.com`

## Vercel nameserver alternative

If you want Vercel to manage DNS entirely, change the domain nameservers at the registrar to:

- `ns1.vercel-dns.com`
- `ns2.vercel-dns.com`

When nameservers are delegated to Vercel, Vercel can automatically create the apex and first-level subdomain records for the project.

## Verification checklist

1. In Vercel, run or inspect the equivalent of `vercel domains inspect randomgorsey.com`
2. Confirm both `randomgorsey.com` and `www.randomgorsey.com` show as configured
3. Wait for SSL issuance to complete
4. Confirm `https://www.randomgorsey.com` loads the Vercel deployment
5. Confirm `https://randomgorsey.com` redirects to `https://www.randomgorsey.com`
6. Confirm the old GitHub Pages headers and IPs are gone from public DNS

## Notes

- Vercel's docs say the values above are the general-purpose defaults. If `vercel domains inspect` shows a project-specific value, use the value shown there.
- If the DNS provider UI asks for just the host label, use `@` for the apex record and `www` for the subdomain.
- Some DNS providers display the CNAME value with a trailing period. Copy the value exactly as the provider expects.
