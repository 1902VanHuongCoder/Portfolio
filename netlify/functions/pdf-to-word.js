const fetch = require('node-fetch');
const FormData = require('form-data');

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle preflight request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Parse the incoming request
    const { fileData, fileName } = JSON.parse(event.body);

    if (!fileData || !fileName) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing file data or file name' }),
      };
    }

    // Use CloudConvert API (free tier: 25 conversions/day)
    // You need to sign up at https://cloudconvert.com/ and get API key
    const CLOUDCONVERT_API_KEY = process.env.CLOUDCONVERT_API_KEY;

    if (!CLOUDCONVERT_API_KEY) {
      // Fallback: Use ConvertAPI (free tier: 250 conversions/month)
      // Sign up at https://www.convertapi.com/
      const CONVERTAPI_SECRET = process.env.CONVERTAPI_SECRET;
      
      if (!CONVERTAPI_SECRET) {
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ 
            error: 'API key not configured. Please set CLOUDCONVERT_API_KEY or CONVERTAPI_SECRET environment variable.' 
          }),
        };
      }

      // Use ConvertAPI
      const response = await fetch(
        `https://v2.convertapi.com/convert/pdf/to/docx?Secret=${CONVERTAPI_SECRET}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            Parameters: [
              {
                Name: 'File',
                FileValue: {
                  Name: fileName,
                  Data: fileData.split(',')[1], // Remove data:application/pdf;base64, prefix
                },
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`ConvertAPI error: ${errorText}`);
      }

      const result = await response.json();
      
      if (result.Files && result.Files.length > 0) {
        const wordFile = result.Files[0];
        
        // Download the converted file
        const fileResponse = await fetch(wordFile.Url);
        const fileBuffer = await fileResponse.arrayBuffer();
        const base64File = Buffer.from(fileBuffer).toString('base64');

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            fileData: base64File,
            fileName: wordFile.FileName,
          }),
        };
      } else {
        throw new Error('Conversion failed: No output file');
      }
    }

    // Use CloudConvert API
    // Step 1: Create a job
    const createJobResponse = await fetch('https://api.cloudconvert.com/v2/jobs', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CLOUDCONVERT_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tasks: {
          'import-pdf': {
            operation: 'import/base64',
            file: fileData.split(',')[1],
            filename: fileName,
          },
          'convert-to-docx': {
            operation: 'convert',
            input: 'import-pdf',
            output_format: 'docx',
            engine: 'office',
            engine_version: '2019',
          },
          'export-docx': {
            operation: 'export/url',
            input: 'convert-to-docx',
          },
        },
      }),
    });

    if (!createJobResponse.ok) {
      const errorText = await createJobResponse.text();
      throw new Error(`CloudConvert error: ${errorText}`);
    }

    const job = await createJobResponse.json();
    const exportTask = job.data.tasks.find(task => task.name === 'export-docx');

    if (!exportTask || !exportTask.result || !exportTask.result.files || exportTask.result.files.length === 0) {
      // Wait for job to complete
      let attempts = 0;
      const maxAttempts = 30;
      let jobStatus;

      while (attempts < maxAttempts) {
        const statusResponse = await fetch(`https://api.cloudconvert.com/v2/jobs/${job.data.id}`, {
          headers: {
            'Authorization': `Bearer ${CLOUDCONVERT_API_KEY}`,
          },
        });

        jobStatus = await statusResponse.json();
        
        if (jobStatus.data.status === 'finished') {
          const exportedTask = jobStatus.data.tasks.find(task => task.name === 'export-docx');
          
          if (exportedTask && exportedTask.result && exportedTask.result.files && exportedTask.result.files.length > 0) {
            const fileUrl = exportedTask.result.files[0].url;
            
            // Download the file
            const fileResponse = await fetch(fileUrl);
            const fileBuffer = await fileResponse.arrayBuffer();
            const base64File = Buffer.from(fileBuffer).toString('base64');

            return {
              statusCode: 200,
              headers,
              body: JSON.stringify({
                success: true,
                fileData: base64File,
                fileName: exportedTask.result.files[0].filename,
              }),
            };
          }
        } else if (jobStatus.data.status === 'error') {
          throw new Error('Conversion failed');
        }

        await new Promise(resolve => setTimeout(resolve, 1000));
        attempts++;
      }

      throw new Error('Conversion timeout');
    }

    // If job completed immediately
    const fileUrl = exportTask.result.files[0].url;
    const fileResponse = await fetch(fileUrl);
    const fileBuffer = await fileResponse.arrayBuffer();
    const base64File = Buffer.from(fileBuffer).toString('base64');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        fileData: base64File,
        fileName: exportTask.result.files[0].filename,
      }),
    };

  } catch (error) {
    console.error('PDF to Word conversion error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to convert PDF to Word',
        message: error.message,
      }),
    };
  }
};
