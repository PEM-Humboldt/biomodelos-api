import Specie from '../../models/specie.model';

/**
 * @swagger
 * /stats/models/{bmClass}:
 *   get:
 *     description: "Obtener la totalidad de modelos según bmClass, discriminados por modelStatus"
 *     operationId: STA1
 *     parameters:
 *       - name: taxID
 *         in: path
 *         description: The taxon ID of the specie
 *         required: true
 *         type: string
 *     responses:
 *       "200":
 *         description: Success
 *         schema:
 *           type: object
 *           required:
 *             - type
 *             - features
 *           properties:
 *             type:
 *               type: string
 *               default: "FeatureCollection"
 *             features:
 *               type: array
 *               items:
 *                 $ref: "#/definitions/FeatureSpeciesRecord"
 *     default:
 *       description: Error
 *       schema:
 *         $ref: "#/definitions/ErrorResponse"
 */
export async function allModelAccordingBmClass(req, res) {
  try {
    const doc = await Specie.aggregate([
      { $match: { bmClass: req.params.bmClass } },
      {
        $lookup: {
          from: 'models',
          localField: 'taxID',
          foreignField: 'taxID',
          as: 'fromModels'
        }
      },
      { $unwind: '$fromModels' },
      {
        $project: {
          modelStatus: '$fromModels.modelStatus',
          bmClass: '$bmClass'
        }
      },
      {
        $group: {
          _id: { bmClass: '$bmClass', modelStatus: '$modelStatus' },
          totalModels: { $sum: 1 }
        }
      },
      {
        $project: {
          modelStatus: '$_id.modelStatus',
          totalModels: '$totalModels',
          _id: 0
        }
      },
      { $sort: { modelStatus: 1 } }
    ]);
    res.send(doc);
  } catch (err) {
    res.json(err);
  }
}
