import React from 'react';
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveLine } from '@nivo/line';
import { ResponsiveBar } from '@nivo/bar';
import { ViewType, ChartData, ChartPosition } from '../types';

interface HSAccidentsStatisticsChartsProps {
  viewType: ViewType;
  data: ChartData[];
  loading: boolean;
  zoomLevel: number;
  position: ChartPosition;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
}

export function HSAccidentsStatisticsCharts({
  viewType,
  data,
  loading,
  zoomLevel,
  position,
  onMouseDown,
  onMouseMove
}: HSAccidentsStatisticsChartsProps) {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-500 dark:text-gray-400">Loading data...</p>
      </div>
    );
  }

  const containerHeight = window.innerWidth >= 1024 ? 'h-[36rem]' : 'h-96';

  return (
    <div className={`${containerHeight} overflow-auto`}>
      {viewType === 'pie' && (
        <div className="h-full flex flex-col items-center justify-center relative chart-container">
          <div 
            className="w-full flex flex-col lg:block relative overflow-hidden" 
            style={{ 
              height: '500px',
              minHeight: '500px',
              position: 'relative'
            }}
          >
            <div
              className="cursor-move absolute inset-0"
              style={{ 
                transform: `scale(${zoomLevel}) translate(${position.x}px, ${position.y}px)`,
                transformOrigin: 'center center',
              }}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
            >
              <ResponsivePie
                data={data.map(item => ({
                  id: item.type,
                  label: item.type,
                  value: item.count
                }))}
                margin={{ 
                  top: 40, 
                  right: window.innerWidth >= 1024 ? 320 : 40,
                  bottom: 140,
                  left: 40
                }}
                innerRadius={0.5}
                padAngle={1}
                cornerRadius={3}
                colors={{ scheme: 'paired' }}
                borderWidth={1}
                borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                enableArcLabels={false}
                arcLinkLabelsOffset={10}
                arcLinkLabelsDiagonalLength={20}
                arcLinkLabelsSkipAngle={10}
                arcLinkLabelsTextColor="#333333"
                arcLinkLabelsThickness={2}
                arcLinkLabelsColor={{ from: 'color' }}
                legends={[
                  {
                    anchor: window.innerWidth >= 1024 ? 'right' : 'bottom',
                    direction: window.innerWidth >= 1024 ? 'column' : 'row',
                    justify: false,
                    translateX: window.innerWidth >= 1024 ? 280 : 0,
                    translateY: window.innerWidth >= 1024 ? 0 : 100,
                    itemsSpacing: 8,
                    itemWidth: 260,
                    itemHeight: 24,
                    itemTextColor: '#555',
                    itemDirection: 'left-to-right',
                    symbolSize: 16,
                    symbolShape: 'circle',
                    effects: [
                      {
                        on: 'hover',
                        style: {
                          itemTextColor: '#000'
                        }
                      }
                    ],
                    wrap: true
                  }
                ]}
                tooltip={({ datum }) => (
                  <div style={{ padding: 8, background: '#fff', border: '1px solid #ccc' }}>
                    <strong>{datum.id}</strong>: {datum.value} ({datum.formattedValue} / {(datum.data?.percent || 0).toFixed(1)}%)
                  </div>
                )}
              />
            </div>
          </div>
        </div>
      )}
      
      {viewType === 'line' && (
        <div className="h-full flex flex-col items-center justify-center relative chart-container">
          <div 
            className="w-full flex flex-col lg:block relative overflow-hidden" 
            style={{ 
              height: '500px',
              minHeight: '500px',
              position: 'relative'
            }}
          >
            <div
              className="cursor-move absolute inset-0"
              style={{ 
                transform: `scale(${zoomLevel}) translate(${position.x}px, ${position.y}px)`,
                transformOrigin: 'center center',
              }}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
            >
              <ResponsiveLine
                data={[
                  {
                    id: 'accidents',
                    data: data.map(item => ({
                      x: item.type,
                      y: item.count
                    }))
                  }
                ]}
                margin={{ 
                  top: 40, 
                  right: window.innerWidth >= 1024 ? 320 : 40,
                  bottom: 140,
                  left: 60
                }}
                xScale={{
                  type: 'point'
                }}
                yScale={{
                  type: 'linear',
                  min: 0,
                  max: 'auto',
                  stacked: false,
                  round: true
                }}
                curve="monotoneX"
                axisTop={null}
                axisRight={null}
                axisBottom={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: -45,
                  legend: 'Type',
                  legendOffset: 100,
                  legendPosition: 'middle'
                }}
                axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: 'Count',
                  legendOffset: -50,
                  legendPosition: 'middle',
                  format: (value) => Math.floor(value)
                }}
                colors={{ scheme: 'paired' }}
                pointSize={10}
                pointColor={{ theme: 'background' }}
                pointBorderWidth={2}
                pointBorderColor={{ from: 'serieColor' }}
                pointLabelYOffset={-12}
                enableArea={true}
                areaOpacity={0.15}
                useMesh={true}
                legends={[
                  {
                    anchor: window.innerWidth >= 1024 ? 'right' : 'bottom',
                    direction: window.innerWidth >= 1024 ? 'column' : 'row',
                    justify: false,
                    translateX: window.innerWidth >= 1024 ? 280 : 0,
                    translateY: window.innerWidth >= 1024 ? 0 : 100,
                    itemsSpacing: 8,
                    itemWidth: 260,
                    itemHeight: 24,
                    itemDirection: 'left-to-right',
                    itemTextColor: '#555',
                    symbolSize: 16,
                    symbolShape: 'circle',
                    effects: [
                      {
                        on: 'hover',
                        style: {
                          itemTextColor: '#000'
                        }
                      }
                    ]
                  }
                ]}
                tooltip={({ point }) => (
                  <div style={{ padding: 8, background: '#fff', border: '1px solid #ccc' }}>
                    <strong>{point.data.x}</strong>: {point.data.y}
                  </div>
                )}
              />
            </div>
          </div>
        </div>
      )}
      
      {viewType === 'bar' && (
        <div className="h-full flex flex-col items-center justify-center relative chart-container">
          <div 
            className="w-full flex flex-col lg:block relative overflow-hidden" 
            style={{ 
              height: '500px',
              minHeight: '500px',
              position: 'relative'
            }}
          >
            <div
              className="cursor-move absolute inset-0"
              style={{ 
                transform: `scale(${zoomLevel}) translate(${position.x}px, ${position.y}px)`,
                transformOrigin: 'center center',
              }}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
            >
              <ResponsiveBar
                data={data.map(item => ({
                  date: item.type,
                  count: item.count
                }))}
                keys={['count']}
                indexBy="date"
                margin={{ 
                  top: 40, 
                  right: window.innerWidth >= 1024 ? 320 : 40,
                  bottom: 140,
                  left: 60
                }}
                padding={0.3}
                valueScale={{ type: 'linear', round: true }}
                indexScale={{ type: 'band', round: true }}
                colors={{ scheme: 'paired' }}
                borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: -45,
                  legend: 'Type',
                  legendPosition: 'middle',
                  legendOffset: 100
                }}
                axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: 'Count',
                  legendPosition: 'middle',
                  legendOffset: -50,
                  format: value => Math.floor(value)
                }}
                labelSkipWidth={12}
                labelSkipHeight={12}
                labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                legends={[
                  {
                    anchor: window.innerWidth >= 1024 ? 'right' : 'bottom',
                    direction: window.innerWidth >= 1024 ? 'column' : 'row',
                    justify: false,
                    translateX: window.innerWidth >= 1024 ? 280 : 0,
                    translateY: window.innerWidth >= 1024 ? 0 : 100,
                    itemsSpacing: 8,
                    itemWidth: 260,
                    itemHeight: 24,
                    itemDirection: 'left-to-right',
                    itemTextColor: '#555',
                    symbolSize: 16,
                    symbolShape: 'circle',
                    effects: [
                      {
                        on: 'hover',
                        style: {
                          itemTextColor: '#000'
                        }
                      }
                    ]
                  }
                ]}
                tooltip={({ value, indexValue }) => (
                  <div style={{ padding: 8, background: '#fff', border: '1px solid #ccc' }}>
                    <strong>{indexValue}</strong>: {value}
                  </div>
                )}
              />
            </div>
          </div>
        </div>
      )}
      
      {viewType === 'table' && (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Count
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-left">
                  {item.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-left">
                  {item.count}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
