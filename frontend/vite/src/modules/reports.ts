import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { ifNoValEmpty } from '../utils'
import Swal from 'sweetalert2';
import { ref, reactive } from 'vue';
import { useMutation, useQuery } from '@urql/vue';
import {
  PUBLISH_SAMPLES,
} from '../graphql/analyses.mutations';
import { 
  SAMPLES_FOR_REPORTS_BY_UIDS,
} from '../graphql/analyses.queries';

export default function useReportComposable(){

    async function generateReports(samples: any[]) {
      console.log(samples)

      const template = await PDFDocument.create()
      const timesRomanBold = await template.embedFont(StandardFonts.TimesRomanBold)
      const helvetica = await template.embedFont(StandardFonts.Helvetica)
      const helveticaBold = await template.embedFont(StandardFonts.HelveticaBold)

      const pageMarginLeft = 50; // margin  x-axis Label
      const pageTop = 800; // Top of the page
      const yDiff = 15; // space between rows

      samples.forEach(sample => {
        console.log(sample)
        let page = template.addPage()

        page.drawText('Felicity Patient Report', {
          x: pageMarginLeft,
          y: pageTop,
          size: 15,
          font: timesRomanBold,
          color: rgb(0, 0.53, 0.71),
        })

        // Patient and Detail Columns
        const patientTop = pageTop - 30
        let leftColXL = pageMarginLeft
        let leftColXV = leftColXL + 90

        page.drawText('Patient Details:', { x: leftColXL, y: patientTop, size: 12, font: helveticaBold, color: rgb(0, 0.53, 0.71) })

        // -----
        page.drawText('First name:', { x: leftColXL, y: patientTop - yDiff * 1, size: 10, font: helveticaBold })
        page.drawText(ifNoValEmpty(sample?.analysisrequest?.patient?.firstName), { x: leftColXV, y: patientTop - yDiff * 1, size: 10, font: helvetica })

        page.drawText('Last name:', { x: leftColXL, y: patientTop - yDiff * 2, size: 10, font: helveticaBold })
        page.drawText(ifNoValEmpty(sample?.analysisrequest?.patient?.lastName), { x: leftColXV, y: patientTop - yDiff * 2, size: 10, font: helvetica })

        page.drawText('Gender:', { x: leftColXL, y: patientTop - yDiff * 3, size: 10, font: helveticaBold })
        page.drawText('', { x: leftColXV, y: patientTop - yDiff * 3, size: 10, font: helvetica })

        page.drawText('Age:', { x: leftColXL, y: patientTop - yDiff * 4, size: 10, font: helveticaBold })
        page.drawText(ifNoValEmpty(sample?.analysisrequest?.patient?.age)?.toString(), { x: leftColXV, y: patientTop - yDiff * 4, size: 10, font: helvetica })

        page.drawText('D.O.B:', { x: leftColXL, y: patientTop - yDiff * 5, size: 10, font: helveticaBold })
        page.drawText(ifNoValEmpty(sample?.analysisrequest?.patient?.dateOfBirth)?.toString(), { x: leftColXV, y: patientTop - yDiff * 5, size: 10, font: helvetica })

        // -----
        let rightColXL = pageMarginLeft + 250
        let rightColXV = rightColXL + 90
        page.drawText('Client Patient Id:', { x: rightColXL, y: patientTop - yDiff * 1, size: 10, font: helveticaBold })
        page.drawText(ifNoValEmpty(sample?.analysisrequest?.patient?.patientId), { x: rightColXV, y: patientTop - yDiff * 1, size: 10, font: helvetica })

        page.drawText('Client name:', { x: rightColXL, y: patientTop - yDiff * 2, size: 10, font: helveticaBold })
        page.drawText(ifNoValEmpty(sample?.analysisrequest?.client?.name), { x: rightColXV, y: patientTop - yDiff * 2, size: 10, font: helvetica })

        page.drawText('Client Phone:', { x: rightColXL, y: patientTop - yDiff * 3, size: 10, font: helveticaBold })
        page.drawText(ifNoValEmpty(sample?.analysisrequest?.client?.phoneMobile)?.toString(), { x: rightColXV, y: patientTop - yDiff * 3, size: 10, font: helvetica })

        page.drawText('Client Email:', { x: rightColXL, y: patientTop - yDiff * 4, size: 10, font: helveticaBold })
        page.drawText(ifNoValEmpty(sample?.analysisrequest?.client?.email), { x: rightColXV, y: patientTop - yDiff * 4, size: 10, font: helvetica })

        // Sample Detail Section
        const sampleTop = patientTop - 110

        page.drawText('Sample Details:', { x: leftColXL, y: sampleTop, size: 12, font: helveticaBold, color: rgb(0, 0.53, 0.71) })

        // -----
        page.drawText('Sample ID:', { x: leftColXL, y: sampleTop - yDiff * 1, size: 10, font: helveticaBold })
        page.drawText(ifNoValEmpty(sample?.analysisrequest?.requestId), { x: leftColXV, y: sampleTop - yDiff * 1, size: 10, font: helvetica })

        page.drawText('Sample Type:', { x: leftColXL, y: sampleTop - yDiff * 2, size: 10, font: helveticaBold })
        page.drawText(ifNoValEmpty(sample?.sampleType?.name), { x: leftColXV, y: sampleTop - yDiff * 2, size: 10, font: helvetica })

        page.drawText('Tests:', { x: leftColXL, y: sampleTop - yDiff * 3, size: 10, font: helveticaBold })
        page.drawText('HIV, FBC', { x: leftColXV, y: sampleTop - yDiff * 3, size: 10, font: helvetica })

        // -----
        page.drawText('Date Collected:', { x: rightColXL, y: sampleTop - yDiff * 1, size: 10, font: helveticaBold })
        page.drawText('', { x: rightColXV, y: sampleTop - yDiff * 1, size: 10, font: helvetica })

        page.drawText('Date Received:', { x: rightColXL, y: sampleTop - yDiff * 2, size: 10, font: helveticaBold })
        page.drawText('', { x: rightColXV, y: sampleTop - yDiff * 2, size: 10, font: helvetica })

        page.drawText('Date Published:', { x: rightColXL, y: sampleTop - yDiff * 3, size: 10, font: helveticaBold })
        page.drawText('', { x: rightColXV, y: sampleTop - yDiff * 3, size: 10, font: helvetica })

        // Results detail section
        let analysesTop = sampleTop - 90

        page.drawText('Analyses Results:', { x: leftColXL, y: analysesTop, size: 12, font: helveticaBold, color: rgb(0, 0.53, 0.71) })

        // -----
        let colSpacer = 110
        page.drawText('Analysis', { x: leftColXL, y: analysesTop - yDiff * 1, size: 10, font: helveticaBold })
        page.drawText('Instrument', { x: leftColXL + colSpacer * 1, y: analysesTop - yDiff * 1, size: 10, font: helveticaBold })
        page.drawText('Method', { x: leftColXL + colSpacer * 2, y: analysesTop - yDiff * 1, size: 10, font: helveticaBold })
        page.drawText('Result', { x: leftColXL + colSpacer * 3, y: analysesTop - yDiff * 1, size: 10, font: helveticaBold })
        page.drawText('Unit', { x: leftColXL + colSpacer * 4, y: analysesTop - yDiff * 1, size: 10, font: helveticaBold })

        // ---
        const results = sample?.analysisResults;
        let count = 0
        results.forEach((analyte: any) => {
          let index = count + 2
          const yPos = analysesTop - yDiff * index

          page.drawText(ifNoValEmpty(analyte?.analysis?.name), { x: leftColXL, y: analysesTop - yDiff * index, size: 10, font: helvetica })
          page.drawText(ifNoValEmpty(analyte?.instrument?.name), { x: leftColXL + colSpacer * 1, y: analysesTop - yDiff * index, size: 10, font: helvetica })
          page.drawText(ifNoValEmpty(analyte?.method?.name), { x: leftColXL + colSpacer * 2, y: analysesTop - yDiff * index, size: 10, font: helvetica })
          page.drawText(ifNoValEmpty(analyte?.result), { x: leftColXL + colSpacer * 3, y: analysesTop - yDiff * index, size: 10, font: helvetica })
          page.drawText(ifNoValEmpty(analyte?.analysis?.unit), { x: leftColXL + colSpacer * 4, y: analysesTop - yDiff * index, size: 10, font: helvetica })

          if (yPos < 40) {
          page = template.addPage()
          analysesTop = pageTop + 50
          count = 1
          }

          count++
        })
      })

      const report = await template.save()

      const filed = new Blob([report], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(filed);
      const printWindow = window.open(fileURL, '', '');
      printWindow?.print();

    }

    let reportUids = ref<number[]>([]);

    const reportProcessor =  useQuery({
        query: SAMPLES_FOR_REPORTS_BY_UIDS,
        variables: { uids:  reportUids },
        requestPolicy: 'network-only',
      })

    const downloadReports = async (uids: number[]) => {
      reportUids.value = uids;

      try {
        Swal.fire({
          title: 'Are you sure?',
          text: "You want to download reports",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, download now!',
          cancelButtonText: 'No, do not download!',
        }).then((result) => {
          if (result.isConfirmed) {


            reportProcessor.executeQuery({requestPolicy: 'network-only'}).then(res => {
              let _samples = res?.data.value?.samplesByUids;
              if(_samples.length > 0) { generateReports(_samples) }
            });

            // Swal.fire(
            //   'Its Happening!',
            //   'Your sample reports are being processed.',
            //   'success'
            // ).then(_ => {})

          }
        })
      } catch (error) {
        console.log(error)
      }
    }

    return {
      generateReports,
      downloadReports,
    }
  }
