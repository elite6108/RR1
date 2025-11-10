import React from 'react';
import { Plus, ChevronUp, ChevronDown } from 'lucide-react';
import type { FormStepProps, CardTicket } from '../../types';
import { INPUT_CLASS_NAME } from '../../utils/constants';
import { Calendar } from '../../../../../utils/calendar/Calendar';

export function Step3CardsTickets({ 
  cardTickets = [], 
  setCardTickets, 
  expandedCards = [], 
  setExpandedCards 
}: FormStepProps) {

  const addCardTicket = () => {
    const newCard: CardTicket = {
      issuer: '',
      card_type: '',
      card_number: '',
      date_added: new Date().toISOString().split('T')[0],
      date_expires: ''
    };
    setCardTickets?.([...cardTickets, newCard]);
  };

  const updateCardTicket = (index: number, field: keyof CardTicket, value: string) => {
    const newCards = [...cardTickets];
    (newCards[index] as any)[field] = value;
    setCardTickets?.(newCards);
  };

  const toggleCard = (index: number) => {
    setExpandedCards?.(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Cards & Tickets <span className="text-gray-400 text-xs">(optional)</span>
        </h3>
        <button
          type="button"
          onClick={addCardTicket}
          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Card/Ticket
        </button>
      </div>
      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
        {cardTickets.map((card, index) => (
          <div key={index} className="border rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => toggleCard(index)}
              className="w-full px-4 py-3 flex justify-between items-center bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              <span className="font-medium text-gray-900 dark:text-white">
                {card.card_type || 'New Card/Ticket'}
              </span>
              {expandedCards.includes(index) ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </button>
            {expandedCards.includes(index) && (
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Issuer</label>
                    <input
                      type="text"
                      value={card.issuer}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        updateCardTicket(index, 'issuer', e.target.value);
                      }}
                      className={INPUT_CLASS_NAME}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Card Type</label>
                    <input
                      type="text"
                      value={card.card_type}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        updateCardTicket(index, 'card_type', e.target.value);
                      }}
                      className={INPUT_CLASS_NAME}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Card Number</label>
                    <input
                      type="text"
                      value={card.card_number}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        updateCardTicket(index, 'card_number', e.target.value);
                      }}
                      className={INPUT_CLASS_NAME}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date Added</label>
                    <Calendar
                      selectedDate={card.date_added}
                      onDateSelect={(date: string) => updateCardTicket(index, 'date_added', date)}
                      placeholder="Select date added"
                      className=""
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                    <Calendar
                      selectedDate={card.date_expires}
                      onDateSelect={(date: string) => updateCardTicket(index, 'date_expires', date)}
                      placeholder="Select expiry date"
                      className=""
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}