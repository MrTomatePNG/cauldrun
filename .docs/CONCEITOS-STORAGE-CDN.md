# Infraestrutura de Mídia: S3, Buckets e CDN

Este documento fornece uma visão técnica sobre as tecnologias utilizadas para armazenamento e entrega de arquivos multimídia no projeto **Sewer Comedy**.

## 1. O que é S3 (Simple Storage Service)?

O **S3** não é um sistema de arquivos tradicional (como o NTFS ou ext4 do seu HD), mas sim um **Armazenamento de Objetos (Object Storage)**. 

### Diferenças Chave:
*   **Hierarquia vs. Flat:** Em vez de uma árvore de diretórios complexa, o S3 é "plano". Cada arquivo é um "objeto" identificado por uma **Key** (chave) única.
*   **Metadados:** Cada objeto carrega metadados (tipo do arquivo, data de criação, permissões) anexados diretamente a ele.
*   **Escalabilidade:** É projetado para armazenar trilhões de objetos com durabilidade de "onze noves" (99.999999999%).

---

## 2. O que é um Bucket?

Um **Bucket** é o container fundamental no S3. Pense nele como a "unidade raiz" ou a partição onde seus arquivos residem.

*   **Namespace Único:** O nome de um bucket deve ser único em toda a região (ou globalmente, dependendo do provedor).
*   **Políticas de Acesso:** É no nível do bucket que definimos quem pode ler ou escrever arquivos. No nosso projeto, configuramos o bucket `sewer-media` como **Public Read** para que o navegador possa exibir as imagens diretamente.

---

## 3. O que é uma CDN (Content Delivery Network)?

A **CDN** é uma rede de servidores distribuídos geograficamente que trabalham juntos para fornecer entrega rápida de conteúdo na Internet.

### Fluxo de Funcionamento:
1.  **Requisição:** O usuário solicita uma imagem.
2.  **Edge Server:** A requisição bate no servidor da CDN mais próximo do usuário (ex: um servidor em São Paulo para um usuário brasileiro).
3.  **Cache:** 
    *   Se a imagem já estiver na CDN, ela é entregue instantaneamente.
    *   Se não estiver, a CDN busca a imagem no **S3 (Origem)**, guarda uma cópia e a entrega ao usuário.
4.  **Vantagens:** 
    *   **Latência reduzida:** Menor distância física entre o dado e o usuário.
    *   **Economia:** Reduz o custo de transferência de dados (egress) do seu provedor de S3.
    *   **Segurança:** Protege a origem (S3) contra ataques de negação de serviço (DDoS).

---

## Referências e Leituras Recomendadas

*   **AWS S3 Documentation:** [O que é o Amazon S3?](https://docs.aws.amazon.com/pt_br/AmazonS3/latest/userguide/Welcome.html)
*   **Cloudflare:** [O que é uma CDN e como funciona?](https://www.cloudflare.com/pt-br/learning/cdn/what-is-a-cdn/)
*   **DigitalOcean:** [Object Storage vs Block Storage](https://www.digitalocean.com/community/tutorials/object-storage-vs-block-storage)
*   **MinIO Documentation:** [MinIO Object Storage Overview](https://min.io/docs/minio/linux/index.html)
