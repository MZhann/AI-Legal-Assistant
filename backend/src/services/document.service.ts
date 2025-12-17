import puppeteer from 'puppeteer';

// Document types
export type DocumentType = 'pretrial-claim' | 'explanatory' | 'resignation';

// Interfaces for each document type
export interface PretrialClaimData {
  recipientName: string;
  recipientAddress: string;
  senderName: string;
  senderAddress: string;
  senderPhone: string;
  senderEmail: string;
  contractDate: string;
  contractNumber: string;
  paidAmount: string;
  violationDescription: string;
  legalBasis: string;
  responseDeadline: string;
  claimAmount: string;
  penaltyAmount?: string;
  bankBik: string;
  bankAccount: string;
  bankRecipient: string;
  attachments: string[];
}

export interface ExplanatoryData {
  recipientPosition: string;
  recipientName: string;
  companyName: string;
  senderPosition: string;
  senderName: string;
  senderDepartment: string;
  incidentDate: string;
  incidentDescription: string;
  explanation: string;
  conclusion: string;
}

export interface ResignationData {
  recipientPosition: string;
  recipientName: string;
  companyName: string;
  senderPosition: string;
  senderName: string;
  resignationDate: string;
  reason?: string;
}

class DocumentService {
  private formatDate(dateStr: string): string {
    if (!dateStr) return '_______________';
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  private getTodayDate(): string {
    return new Date().toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  private getBaseStyles(): string {
    return `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=PT+Serif:wght@400;700&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'PT Serif', 'Times New Roman', serif;
          font-size: 12pt;
          line-height: 1.5;
          color: #000;
          padding: 20mm 15mm 20mm 25mm;
        }
        
        .header {
          text-align: right;
          margin-bottom: 30px;
        }
        
        .header p {
          margin: 2px 0;
        }
        
        .title {
          text-align: center;
          font-weight: bold;
          font-size: 14pt;
          margin: 30px 0;
          text-transform: uppercase;
        }
        
        .body {
          text-align: justify;
        }
        
        .body p {
          margin-bottom: 12px;
          text-indent: 1.25cm;
        }
        
        .body p.no-indent {
          text-indent: 0;
        }
        
        .indent {
          margin-left: 1.25cm;
        }
        
        .bold {
          font-weight: bold;
        }
        
        .signature {
          margin-top: 50px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }
        
        .signature-line {
          text-align: center;
        }
        
        .signature-line .line {
          border-bottom: 1px solid #000;
          min-width: 150px;
          display: inline-block;
        }
        
        .signature-line small {
          display: block;
          font-size: 9pt;
          margin-top: 3px;
        }
        
        .attachments {
          margin-top: 20px;
        }
        
        .attachments ul {
          list-style: none;
          margin-left: 1.25cm;
        }
      </style>
    `;
  }

  async generatePDF(type: DocumentType, data: any): Promise<Buffer> {
    let html: string;

    switch (type) {
      case 'pretrial-claim':
        html = this.createPretrialClaimHTML(data as PretrialClaimData);
        break;
      case 'explanatory':
        html = this.createExplanatoryHTML(data as ExplanatoryData);
        break;
      case 'resignation':
        html = this.createResignationHTML(data as ResignationData);
        break;
      default:
        throw new Error('Unknown document type');
    }

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });
      
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '10mm', bottom: '10mm', left: '0', right: '0' },
      });

      return Buffer.from(pdfBuffer);
    } finally {
      await browser.close();
    }
  }

  private createPretrialClaimHTML(data: PretrialClaimData): string {
    const attachmentsHtml = data.attachments && data.attachments.length > 0
      ? `
        <div class="attachments">
          <p class="bold no-indent">Приложения:</p>
          <ul>
            ${data.attachments.map((att, i) => `<li>${i + 1}. ${att}</li>`).join('')}
          </ul>
        </div>
      `
      : '';

    const penaltyHtml = data.penaltyAmount
      ? `<p class="indent">2. Выплатить неустойку за нарушение сроков в размере ${data.penaltyAmount} тенге.</p>`
      : '';

    return `
      <!DOCTYPE html>
      <html lang="ru">
      <head>
        <meta charset="UTF-8">
        ${this.getBaseStyles()}
      </head>
      <body>
        <div class="header">
          <p><strong>Кому:</strong> ${data.recipientName}</p>
          <p><strong>Адрес:</strong> ${data.recipientAddress}</p>
          <br>
          <p><strong>От кого:</strong> ${data.senderName}</p>
          <p><strong>Адрес:</strong> ${data.senderAddress}</p>
          <p><strong>Тел.:</strong> ${data.senderPhone}</p>
          <p><strong>E-mail:</strong> ${data.senderEmail || '-'}</p>
        </div>

        <h1 class="title">Досудебная претензия</h1>

        <div class="body">
          <p>
            «${this.formatDate(data.contractDate)}» между мной и Вашей организацией был заключен договор 
            №${data.contractNumber}. Согласно условиям договора/закона, я свои обязательства выполнил(а) 
            в полном объеме, оплатив сумму в размере ${data.paidAmount} тенге.
          </p>

          <p class="no-indent">Однако Вами были нарушены обязательства, а именно:</p>
          <p class="indent"><em>${data.violationDescription}</em></p>

          <p class="no-indent">Данные действия нарушают мои права, предусмотренные:</p>
          <p class="indent">${data.legalBasis}</p>

          <p class="bold no-indent">В связи с вышеизложенным, ТРЕБУЮ:</p>
          <p class="indent">
            1. В срок до ${this.formatDate(data.responseDeadline)} выплатить мне денежные средства 
            в размере ${data.claimAmount} тенге.
          </p>
          ${penaltyHtml}

          <p class="no-indent">Денежные средства прошу перечислить по следующим реквизитам:</p>
          <p class="indent">БИК: ${data.bankBik}</p>
          <p class="indent">Номер счета: ${data.bankAccount}</p>
          <p class="indent">Получатель: ${data.bankRecipient}</p>

          <p>
            В случае игнорирования моих требований или отказа в их удовлетворении, я буду вынужден(а) 
            обратиться в суд с исковым заявлением для принудительного взыскания денежных средств. 
            В этом случае с Вас также будут взысканы: штраф в размере 50% от суммы иска, расходы на 
            оплату услуг адвоката и компенсация морального вреда.
          </p>

          ${attachmentsHtml}
        </div>

        <div class="signature">
          <div>«${this.getTodayDate()}»</div>
          <div class="signature-line">
            <span class="line"></span> / ${data.senderName}
            <small>(подпись)</small>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private createExplanatoryHTML(data: ExplanatoryData): string {
    return `
      <!DOCTYPE html>
      <html lang="ru">
      <head>
        <meta charset="UTF-8">
        ${this.getBaseStyles()}
      </head>
      <body>
        <div class="header">
          <p>${data.recipientPosition}</p>
          <p>${data.companyName}</p>
          <p>${data.recipientName}</p>
          <br>
          <p>от ${data.senderPosition}</p>
          <p>${data.senderDepartment}</p>
          <p>${data.senderName}</p>
        </div>

        <h1 class="title">Объяснительная записка</h1>

        <div class="body">
          <p class="no-indent">${this.formatDate(data.incidentDate)} произошло следующее:</p>
          <p class="indent"><em>${data.incidentDescription}</em></p>

          <p class="no-indent">Причины произошедшего:</p>
          <p class="indent">${data.explanation}</p>

          ${data.conclusion ? `<p>${data.conclusion}</p>` : ''}
        </div>

        <div class="signature">
          <div>«${this.getTodayDate()}»</div>
          <div class="signature-line">
            <span class="line"></span> / ${data.senderName}
            <small>(подпись)</small>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private createResignationHTML(data: ResignationData): string {
    return `
      <!DOCTYPE html>
      <html lang="ru">
      <head>
        <meta charset="UTF-8">
        ${this.getBaseStyles()}
      </head>
      <body>
        <div class="header">
          <p>${data.recipientPosition}</p>
          <p>${data.companyName}</p>
          <p>${data.recipientName}</p>
          <br>
          <p>от ${data.senderPosition}</p>
          <p>${data.senderName}</p>
        </div>

        <h1 class="title">Заявление</h1>

        <div class="body">
          <p>
            Прошу уволить меня по собственному желанию с занимаемой должности ${data.senderPosition} 
            с ${this.formatDate(data.resignationDate)}.
          </p>

          ${data.reason ? `<p>Причина увольнения: ${data.reason}</p>` : ''}
        </div>

        <div class="signature">
          <div>«${this.getTodayDate()}»</div>
          <div class="signature-line">
            <span class="line"></span> / ${data.senderName}
            <small>(подпись)</small>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  getDocumentTypes() {
    return [
      {
        id: 'pretrial-claim',
        title: 'Досудебная претензия',
        titleKz: 'Сотқа дейінгі талап',
        description: 'Претензия для досудебного урегулирования споров с организациями',
        descriptionKz: 'Ұйымдармен дауларды сотқа дейін реттеу үшін талап',
        icon: 'FileWarning',
      },
      {
        id: 'explanatory',
        title: 'Объяснительная записка',
        titleKz: 'Түсіндірме жазба',
        description: 'Записка для объяснения причин нарушения или происшествия',
        descriptionKz: 'Бұзушылық немесе оқиға себептерін түсіндіру үшін жазба',
        icon: 'FileText',
      },
      {
        id: 'resignation',
        title: 'Заявление на увольнение',
        titleKz: 'Жұмыстан шығу өтініші',
        description: 'Заявление об увольнении по собственному желанию',
        descriptionKz: 'Өз еркімен жұмыстан шығу туралы өтініш',
        icon: 'FileX',
      },
    ];
  }
}

export const documentService = new DocumentService();
