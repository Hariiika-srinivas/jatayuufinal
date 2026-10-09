/**
 * JATAYU — Full-Stack Server & Proxy
 * Provides healthchecks, sample dataset endpoints, and static serving in production.
 */

import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health Check
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'JATAYU Disaster Intelligence Platform',
    timestamp: new Date().toISOString(),
    models: {
      prithvi_flood_segmentation: {
        name: 'Prithvi-EO-2.0-300M-TL-Sen1Floods11',
        checkpoint_loaded: true,
        input_bands: ['B2', 'B3', 'B4', 'B8A', 'B11', 'B12'],
        target: 'Surface Water & Flood Extent Segmentation'
      },
      building_footprint_detector: {
        name: 'High-Resolution Optical Building Detector',
        status: 'active',
        structural_damage_assessment: 'Not assessed — compatible damage model required'
      }
    },
    hardware: {
      device: 'CPU / Accelerated Web Worker'
    }
  });
});

// Sample datasets endpoint
app.get('/api/sample-datasets', (req: Request, res: Response) => {
  res.json({
    samples: [
      {
        id: 'india-assam-sen1floods11',
        name: 'India — Assam Brahmaputra Flood (Sen1Floods11)',
        file: 'India_900498_S2Hand.tif',
        bands_count: 13,
        compatible_models: ['Prithvi-EO-2.0-300M-TL-Sen1Floods11', 'Combined Exposure Pipeline']
      },
      {
        id: 'spain-ebro-sen1floods11',
        name: 'Spain — Ebro Basin Inundation',
        file: 'Spain_7370579_S2Hand.tif',
        bands_count: 13,
        compatible_models: ['Prithvi-EO-2.0-300M-TL-Sen1Floods11', 'Combined Exposure Pipeline']
      },
      {
        id: 'usa-midwest-sen1floods11',
        name: 'USA — Midwest Flooding Event',
        file: 'USA_430764_S2Hand.tif',
        bands_count: 13,
        compatible_models: ['Prithvi-EO-2.0-300M-TL-Sen1Floods11', 'Combined Exposure Pipeline']
      }
    ]
  });
});

// Serve dist directory in production
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`[JATAYU] Server active on port ${PORT}`);
});
