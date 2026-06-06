import fs from 'fs';
import path from 'path';

const file = path.resolve('src/App.tsx');
let content = fs.readFileSync(file, 'utf8');

// 1. Insert galleryFiles array right before "const portfolioProjects = ["
const targetBefore = 'const portfolioProjects = [';
const insertIndex = content.indexOf(targetBefore);

if (insertIndex === -1) {
  console.error('Error: "const portfolioProjects = [" not found!');
  process.exit(1);
}

const galleryFilesDefinition = `const galleryFiles = [
    {
      id: 'gf1',
      title: 'Thiết kế 1: CorelDRAW Vector Art (.cdr)',
      description: 'Bản thiết kế số 1 chuyên nghiệp trên nền tảng CorelDRAW, tối ưu hóa các nét vẽ vector và phân bổ layer màu sắc.',
      previewUrl: '/gallery/1_preview.png',
      fileUrl: '/gallery/1.cdr',
      fileName: '1.cdr',
      fileType: 'cdr',
      badge: 'CorelDRAW Vector'
    },
    {
      id: 'gf2',
      title: 'Thiết kế 2: CorelDRAW Layout (.cdr)',
      description: 'Tác phẩm đồ họa số 2 thiết kế bố cục chuyên sâu, chuẩn hóa lưới tọa độ và phân cấp thị giác học thuật.',
      previewUrl: '/gallery/2_preview.png',
      fileUrl: '/gallery/2.cdr',
      fileName: '2.cdr',
      fileType: 'cdr',
      badge: 'CorelDRAW Design'
    },
    {
      id: 'gf3',
      title: 'Thiết kế 3: CorelDRAW Graphic (.cdr)',
      description: 'Ấn phẩm thiết kế số 3 tối ưu hóa phông chữ, biểu đồ và các khối hình học phục vụ truyền tải dữ liệu trực quan.',
      previewUrl: '/gallery/3_preview.png',
      fileUrl: '/gallery/3.cdr',
      fileName: '3.cdr',
      fileType: 'cdr',
      badge: 'CorelDRAW Art'
    },
    {
      id: 'gf4',
      title: 'Thiết kế 4: CorelDRAW Poster (.cdr)',
      description: 'Thiết kế ấn phẩm truyền thông số 4 trên CorelDRAW, kết hợp hài hòa màu sắc sinh thái và phân khu thông tin y dược.',
      previewUrl: '/gallery/4_preview.png',
      fileUrl: '/gallery/4.cdr',
      fileName: '4.cdr',
      fileType: 'cdr',
      badge: 'CorelDRAW Media'
    },
    {
      id: 'gf5',
      title: 'Thiết kế 5: Hình ảnh minh họa (.jpg)',
      description: 'Sản phẩm truyền thông dạng hình ảnh chất lượng cao, thiết kế tỉ mỉ từng khối màu tương tương phản và thông điệp.',
      previewUrl: '/gallery/5.jpg',
      fileUrl: '/gallery/5.jpg',
      fileName: '5.jpg',
      fileType: 'jpg',
      badge: 'JPG Image'
    },
    {
      id: 'gf6',
      title: 'Thiết kế 6: CorelDRAW Artwork (.cdr)',
      description: 'Tác phẩm vector số 6 hoàn thiện trên CorelDRAW, cấu trúc thiết kế hiện đại, sẵn sàng in ấn chất lượng cao.',
      previewUrl: '/gallery/6_preview.png',
      fileUrl: '/gallery/6.cdr',
      fileName: '6.cdr',
      fileType: 'cdr',
      badge: 'CorelDRAW Final'
    },
    {
      id: 'gf7',
      title: 'Thiết kế 7: Hình ảnh mỹ thuật (.jpg)',
      description: 'Bản thiết kế dạng hình ảnh chất lượng cao thứ 7, truyền tải sinh động các khía cạnh mỹ thuật số trong y tế thông minh.',
      previewUrl: '/gallery/7.jpg',
      fileUrl: '/gallery/7.jpg',
      fileName: '7.jpg',
      fileType: 'jpg',
      badge: 'JPG Artwork'
    }
  ];

  `;

content = content.substring(0, insertIndex) + galleryFilesDefinition + content.substring(insertIndex);

// 2. Replace the gallery rendering block
const startGalleryTerm = 'viewMode === \'gallery\' ? (';
const startGalleryIndex = content.indexOf(startGalleryTerm);

if (startGalleryIndex === -1) {
  console.error('Error: "viewMode === \'gallery\' ? (" not found!');
  process.exit(1);
}

const restOfContent = content.substring(startGalleryIndex);
const endGalleryTerm = ') : (';
const relativeEndIndex = restOfContent.indexOf(endGalleryTerm);

if (relativeEndIndex === -1) {
  console.error('Error: ") : (" not found after gallery start!');
  process.exit(1);
}

const endGalleryIndex = startGalleryIndex + relativeEndIndex;

const galleryReplacement = `viewMode === 'gallery' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {galleryFiles.map((file, idx) => (
                  <Card
                    key={file.id}
                    className="hover-lift overflow-hidden flex flex-col justify-between h-full rounded-2xl border-slate-200/80 shadow-xs hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-300"
                  >
                    <div>
                      {/* Preview Image with Hover zoom & Lightbox trigger */}
                      <div 
                        onClick={() => setSelectedImage(file.previewUrl)}
                        className="h-44 w-full overflow-hidden bg-slate-100 relative group border-b border-emerald-50/20 cursor-zoom-in"
                      >
                        <img
                          src={file.previewUrl}
                          alt={file.title}
                          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="inline-flex items-center rounded-md border border-emerald-200/30 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wide text-emerald-800 shadow-xs">
                            {file.badge}
                          </span>
                        </div>
                        <div className="absolute inset-0 bg-emerald-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white text-xs font-bold bg-emerald-800/95 px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-md">
                            <Eye className="w-3.5 h-3.5" /> Xem ảnh lớn
                          </span>
                        </div>
                      </div>

                      {/* Card Content */}
                      <CardContent className="pt-5 space-y-2 px-5">
                        <CardTitle className="text-slate-900 dark:text-slate-100 text-sm font-black tracking-tight leading-tight">
                          {file.title}
                        </CardTitle>
                        
                        <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed text-justify font-semibold">
                          {file.description}
                        </p>
                      </CardContent>
                    </div>

                    {/* Card Actions */}
                    <CardFooter className="px-5 pb-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3 bg-slate-50/30 dark:bg-slate-900/10">
                      <Button
                        onClick={() => setSelectedImage(file.previewUrl)}
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="px-2 text-xs text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 hover:bg-emerald-50/50"
                      >
                        <Eye className="w-3.5 h-3.5" /> Xem ảnh
                      </Button>
                      
                      <a
                        href={file.fileUrl}
                        download={file.fileName}
                        className="text-[10px] uppercase font-black text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors flex items-center gap-1.5 font-sans"
                      >
                        <FileDown className="w-3.5 h-3.5" /> Tải file gốc
                      </a>
                    </CardFooter>
                  </Card>
                ))}
              </div>`;

const newContent = content.substring(0, startGalleryIndex) + galleryReplacement + content.substring(endGalleryIndex);
fs.writeFileSync(file, newContent, 'utf8');
console.log('✅ Gallery view updated to show files 1 to 7 successfully in App.tsx');
