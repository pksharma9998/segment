import React, { useState } from 'react';
import { FaLessThan, FaPlus, FaMinus } from 'react-icons/fa';
import { SCHEMA_OPTIONS, SchemaOption } from '../../config';
import { ADD_NEW_SCHEMA, ADD_SCHEMA_SEGMENT, CANCEL, ENTER_SEGMENT, SAVE_CHANGES, SAVE_SEGMENT, SAVE_THE_SEGMENT, SAVING_SEGMENT } from '../../constants';

const Segment: React.FC = () => {
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [segmentName, setSegmentName] = useState<string>('');
  const [selectedSchemas, setSelectedSchemas] = useState<any[]>([]);
  const [currentSchema, setCurrentSchema] = useState<string>('');
  const [availableSchemas, setAvailableSchemas] = useState(SCHEMA_OPTIONS);

  /**
   * Function to handle adding a new schema dropdown when the "+Add new schema" is clicked.
   * The selected schema is removed from the available options and added to the list of selected schemas.
   */
  const handleAddNewSchema = () => {
    if (currentSchema && !selectedSchemas.includes(currentSchema)) {
      const selectedOption = availableSchemas.find(schema => schema.value === currentSchema);
      setSelectedSchemas([...selectedSchemas, selectedOption]);
      setAvailableSchemas(availableSchemas.filter(schema => schema.value !== currentSchema));
      setCurrentSchema(''); // Reset dropdown after selection
    }
  };

  /**
  * Removes a schema from the selectedSchemas list and adds it back to availableSchemas.
  */
  const handleRemoveSchema = (schemaToRemove: SchemaOption) => {
    setSelectedSchemas(selectedSchemas.filter(schema => schema.value !== schemaToRemove.value));
    setAvailableSchemas([...availableSchemas, schemaToRemove]);
  };

  /**
  * Function to handle saving the segment when the "Save segment" button is clicked.
  * It sends the segment name and selected schemas to the server using a webhook.
  */
  const handleSaveSegment = () => {
    const segmentData = {
      segment_name: segmentName,
      schema: selectedSchemas.map((schema: any) => ({ [schema.value]: schema.label }))
    };

    // Send data to the server using the webhook URL
    fetch('https://webhook.site/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(segmentData)
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  /**
   * Resets the form and state.
   */
  const resetForm = () => {
    setShowPopup(false);
    setSegmentName('');
    setSelectedSchemas([]);
    setAvailableSchemas(SCHEMA_OPTIONS);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black/50 backdrop-blur-md">
      <button
        className="bg-transparent hover:bg-[#16A7C6] text-white font-semibold hover:text-white py-2 px-4 border-4 hover:border-transparent rounded"
        onClick={() => setShowPopup(true)}
        style={{ border: '4px solid #fff' }}
      >
        {SAVE_CHANGES}
      </button>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-end bg-gray-900 bg-opacity-50">
          <div
            className={`bg-white shadow-lg w-80 h-full transform transition-transform ${showPopup ? 'animate-slide-in-right' : 'animate-slide-out-right'
              } flex flex-col`}
          >
            {/* Top section */}
            <div className="bg-[#16A7C6] p-4">
              <h3 className="flex items-center text-lg font-semibold text-white">
                <FaLessThan className="mr-2" /> {SAVING_SEGMENT}
              </h3>
            </div>

            {/* Form section */}
            <div className="p-6 flex-grow overflow-y-auto">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                {ENTER_SEGMENT}
              </label>
              <input
                id="name"
                type="text"
                placeholder="Enter segment name"
                value={segmentName}
                onChange={(e) => setSegmentName(e.target.value)}
                className="w-full px-3 py-2 mb-4 border border-gray-300 rounded"
              />

              <p className="text-sm text-black mb-5">{SAVE_SEGMENT}</p>

              {/* Display Selected Schemas */}
              {selectedSchemas?.length > 0 && (
                <div className="mt-5 mb-4">
                  {selectedSchemas.map((schema, index) => (
                    <div key={index} className="flex items-center border border-blue-500 px-3 py-2 rounded bg-blue-50 mb-2">
                      <span className="font-medium flex-grow">{schema.label}</span>
                      <button
                        className="bg-[#CAEAF1] p-1 rounded-[5px] text-black hover:text-red-800"
                        onClick={() => handleRemoveSchema(schema)}
                      >
                        <FaMinus />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {/* Add new schema */}
              <div className="flex flex-wrap gap-4 items-center mb-4">
                <select
                  value={currentSchema}
                  onChange={(e) => setCurrentSchema(e.target.value)}
                  className="flex-grow border border-gray-300 px-3 py-2 rounded"
                >
                  <option value="">{ADD_SCHEMA_SEGMENT}</option>
                  {availableSchemas.map(schema => (
                    <option key={schema.value} value={schema.value}>
                      {schema.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleAddNewSchema}
                  className="flex items-center text-green-600 py-2"
                >
                  <FaPlus className="mr-1" />
                  <span className="underline decoration-2 underline-offset-[4px]">
                    {ADD_NEW_SCHEMA}
                  </span>
                </button>
              </div>
            </div>

            {/* Footer section */}
            <div className="bg-gray-100 p-4 flex flex-col sm:flex-row">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full sm:w-auto mb-2 sm:mb-0"
                onClick={handleSaveSegment}
              >
                {SAVE_THE_SEGMENT}
              </button>
              <button
                className="ml-0 sm:ml-2 bg-white text-red-500 px-4 py-2 rounded hover:text-[#fff] hover:bg-red-600 w-full sm:w-auto"
                onClick={resetForm}
              >
                {CANCEL}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Segment;
