set nocompatible
filetype off

set rtp+=~/.vim/bundle/Vundle.vim
call vundle#begin()

Plugin 'VundleVim/Vundle.vim'

Plugin 'morhetz/gruvbox'

" markdown 插件
Plugin 'godlygeek/tabular'

"目录树插件
Plugin 'scrooloose/nerdtree'

call vundle#end()
filetype plugin indent on

"使用 <C-n> 命令打开和关闭目录树
map <C-n> :NERDTreeToggle<CR>
"显示行号
let NERDTreeShowLineNumbers=1
let NERDTreeAutoCenter=1
"显示隐藏文件
let NERDTreeShowHidden=1
"设置宽度
let NERDTreeWinSize=35

"制表符占用空格数
set tabstop=4
set softtabstop=4
set shiftwidth=4
"set noexpandtab
" 制表符扩展为空格
set expandtab
set nu
set autoindent
set cindent
set cursorline
set cursorcolumn
" 定义快捷键的前缀
let mapleader=";"
nmap ;wh <C-w>h
nmap ;wj <C-w>j
nmap ;wk <C-w>k
nmap ;wl <C-w>l

"开启文件类型侦测
filetype on
"根据侦测的不同文件加载对应的插件
filetype plugin on

" 设置不自动折叠
set nofoldenable
" 设置基于缩进或语法进行代码折叠
set foldmethod=syntax

syntax enable
syntax on

"autocmd BufWritePost ~/.vimrc source ~/.vimrc

" 禁止光标闪烁
set gcr=a:block-blinkon0

" 禁止显示滚动条
set guioptions-=l
set guioptions-=L
set guioptions-=r
set guioptions-=R

" 禁止显示菜单和工具条
set guioptions-=m
set guioptions-=T

" 设置 GUI vim 下的字体大小
set guifont=Monospace\ 13

set background=dark
set t_Co=256
"let g:gruvbox_termcolors=16
colorscheme gruvbox

nmap ;p "+p
nmap ;y "+y
"colorscheme molokai
"colorscheme phd

" GVim样式
"blue.vim
"darkblue.vim
"default.vim
"delek.vim
"desert.vim
"elflord.vim
"evening.vim
"industry.vim
"koehler.vim
"morning.vim
"murphy.vim
"pablo.vim
"peachpuff.vim
"README.txt
"ron.vim
"shine.vim
"slate.vim
"torte.vim
"zellner.vim
